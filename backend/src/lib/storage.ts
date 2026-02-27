import fs from 'fs/promises'; // Use promises for non-blocking I/O
import path from 'path';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';
import { logger } from './logger';

export interface IStorageService {
    uploadFile(file: Express.Multer.File): Promise<string>;
    deleteFile(url: string): Promise<void>;
}

/**
 * Local Storage Implementation
 */
class LocalStorageService implements IStorageService {
    private readonly uploadsDir = path.resolve(env.UPLOADS_DIR);

    async uploadFile(file: Express.Multer.File): Promise<string> {
        // Multer handles the physical write; we just provide the public path
        return `/uploads/${file.filename}`;
    }

    async deleteFile(url: string): Promise<void> {
        try {
            const filename = url.split('/uploads/')[1];
            if (!filename) return;

            const filePath = path.join(this.uploadsDir, filename);
            await fs.unlink(filePath); // Async delete
        } catch (err: any) {
            if (err.code !== 'ENOENT') { // Ignore if file already gone
                logger.error({ err, url }, 'Failed to delete local file');
            }
        }
    }
}

/**
 * AWS S3 Storage Implementation
 */
class S3StorageService implements IStorageService {
    private readonly client: S3Client;
    private readonly bucket = env.S3_BUCKET;

    constructor() {
        this.validateConfig();
        this.client = new S3Client({
            region: env.S3_REGION,
            credentials: {
                accessKeyId: env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
            },
        });
    }

    private validateConfig() {
        const required = ['S3_BUCKET', 'S3_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
        for (const key of required) {
            if (!env[key as keyof typeof env]) {
                throw new Error(`S3 Configuration missing: ${key}`);
            }
        }
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const key = `covers/cover-${Date.now()}-${Math.floor(Math.random() * 1e9)}${path.extname(file.originalname)}`;

        await this.client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));

        return `https://${this.bucket}.s3.${env.S3_REGION}.amazonaws.com/${key}`;
    }

    async deleteFile(url: string): Promise<void> {
        try {
            const key = url.split('.amazonaws.com/')[1];
            if (!key) return;

            await this.client.send(new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }));
        } catch (err) {
            logger.error({ err, url }, 'Failed to delete S3 file');
        }
    }
}

// Factory Export
export const storageService: IStorageService =
    env.STORAGE_PROVIDER === 's3' ? new S3StorageService() : new LocalStorageService();
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';
import { logger } from './logger';
import { StorageConstants } from '../constants';

export interface IStorageService {
    uploadFile(file: Express.Multer.File): Promise<string>;
    deleteFile(url: string): Promise<void>;
}

const OPTIMIZATION_CONFIG = {
    maxWidth: 600,
    maxHeight: 600,
    quality: 70,
    format: 'webp' as const,
};

/**
 * Common image optimization logic
 */
async function optimizeImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .resize({
            width: OPTIMIZATION_CONFIG.maxWidth,
            height: OPTIMIZATION_CONFIG.maxHeight,
            fit: 'inside',
            withoutEnlargement: true,
        })
        .toFormat(OPTIMIZATION_CONFIG.format, { quality: OPTIMIZATION_CONFIG.quality })
        .toBuffer();
}

/**
 * Local Storage Implementation
 */
class LocalStorageService implements IStorageService {
    private readonly uploadsDir = path.resolve(env.UPLOADS_DIR);

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const optimizedBuffer = await optimizeImage(file.buffer);
        const filename = `cover-${Date.now()}-${Math.floor(Math.random() * 1e9)}.webp`;
        const filePath = path.join(this.uploadsDir, filename);

        await fs.writeFile(filePath, optimizedBuffer);
        logger.info({ filePath, filename }, 'Local file uploaded successfully');
        return `${StorageConstants.LOCAL_UPLOADS_PATH}${filename}`;
    }

    async deleteFile(url: string): Promise<void> {
        try {
            const filename = url.split(StorageConstants.LOCAL_UPLOADS_PATH)[1];
            if (!filename) return;

            const filePath = path.join(this.uploadsDir, filename);
            await fs.unlink(filePath);
        } catch (err: unknown) {
            const error = err as { code?: string; message?: string };
            if (error.code !== 'ENOENT') {
                logger.error({ err: error, url }, 'Failed to delete local file');
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
        const optimizedBuffer = await optimizeImage(file.buffer);
        const key = `${StorageConstants.S3_COVERS_PREFIX}cover-${Date.now()}-${Math.floor(Math.random() * 1e9)}.webp`;

        await this.client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: optimizedBuffer,
            ContentType: 'image/webp',
            CacheControl: 'public, max-age=31536000, immutable',
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
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from '../config/env';
import { logger } from './logger';
import { StorageConstants } from '../constants';

export interface ImageMetadata {
    url: string;
    width: number;
    height: number;
    sizeBytes: number;
    mimeType: string;
}

export interface IStorageService {
    generatePresignedUrl(contentType: string): Promise<{ uploadUrl: string, finalUrl: string }>;
    deleteFile(url: string): Promise<void>;
}

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
                logger.warn(`S3 Configuration missing: ${key}. Uploads will fail.`);
            }
        }
    }

    async generatePresignedUrl(contentType: string): Promise<{ uploadUrl: string, finalUrl: string }> {
        const key = `${StorageConstants.S3_COVERS_PREFIX}cover-${Date.now()}-${Math.floor(Math.random() * 1e9)}.webp`;
        const command = new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
            CacheControl: 'public, max-age=31536000, immutable',
        });
        
        const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 300 });

        return {
            uploadUrl,
            finalUrl: StorageConstants.getS3Url(this.bucket, key)
        };
    }

    async deleteFile(url: string): Promise<void> {
        try {
            const key = StorageConstants.extractS3Key(url);
            if (!key) return;

            await this.client.send(new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }));
            logger.info({ url }, 'Deleted file from S3');
        } catch (err) {
            logger.error({ err, url }, 'Failed to delete S3 file');
        }
    }
}

export const storageService: IStorageService = new S3StorageService();
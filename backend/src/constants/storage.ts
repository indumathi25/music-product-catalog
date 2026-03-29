import { env } from '../config/env';

export const StorageConstants = {
    S3_COVERS_PREFIX: 'covers/',
    getS3Url: (bucket: string | undefined, key: string) => `https://${bucket}.s3.${env.S3_REGION}.amazonaws.com/${key}`,
    extractS3Key: (url: string) => url.split('.amazonaws.com/')[1],
};

import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('4000').transform(Number),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    UPLOADS_DIR: z.string().default('./uploads'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    MAX_FILE_SIZE_MB: z.string().default('5').transform(Number),
    STORAGE_PROVIDER: z.enum(['local', 's3']).default('local'),
    S3_BUCKET: z.string().optional(),
    S3_REGION: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}

export const env = parsed.data;

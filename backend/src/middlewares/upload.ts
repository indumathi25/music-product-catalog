import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { env } from '../config/env';
import { AppError } from './errorHandler';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const UPLOADS_DIR = path.resolve(env.UPLOADS_DIR);

// Ensure directory exists once at startup rather than on every upload
if (env.STORAGE_PROVIDER !== 's3' && !fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Define Storage Strategies
const storageStrategies = {
    s3: multer.memoryStorage(),
    local: multer.memoryStorage(),
};

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(null, true);
    }

    cb(new AppError(400, 'INVALID_FILE_TYPE', `Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`));
};

export const upload = multer({
    storage: storageStrategies[env.STORAGE_PROVIDER as keyof typeof storageStrategies] || storageStrategies.local,
    fileFilter,
    limits: {
        fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024,
    },
});
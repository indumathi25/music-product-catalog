import { Request, Response, NextFunction } from 'express';
import { artistRepository } from './repository';

export const artistController = {
    searchByName: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const name = (req.query.name as string | undefined)?.trim();

            if (!name) {
                res.json({ data: null });
                return;
            }

            const artist = await artistRepository.findByName(name);
            res.json({ data: artist });
        } catch (err) {
            next(err);
        }
    },
};

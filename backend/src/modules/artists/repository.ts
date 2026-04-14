import { prisma } from '../../lib/prisma';
import { ArtistSearchResponse } from './types';

export const artistRepository = {
    /**
     * Find an artist by exact name match and return their full image library.
     * Returns null if no artist with that name exists.
     */
    findByName: async (name: string): Promise<ArtistSearchResponse | null> => {
        const artist = await prisma.artist.findUnique({
            where: { name },
            include: {
                images: {
                    orderBy: { created_at: 'desc' },
                },
            },
        });

        if (!artist) return null;

        return {
            id: artist.id,
            name: artist.name,
            images: artist.images.map((img) => ({
                id: img.id,
                url: img.url,
                width: img.width,
                height: img.height,
                mimeType: img.mime_type,
                sizeBytes: img.size_bytes,
                createdAt: img.created_at.toISOString(),
            })),
        };
    },

    findAll: async (): Promise<{ id: string; name: string }[]> => {
        return prisma.artist.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });
    },
};

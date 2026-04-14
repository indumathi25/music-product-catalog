import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { CreateProductDto, UpdateProductDto, Product } from './types';

export const productRepository = {
    findAll: async (params: {
        search?: string;
        artistName?: string;
        skip?: number;
        take?: number;
    }): Promise<Product[]> => {
        const { search, artistName, skip, take } = params;

        const where: Prisma.ProductWhereInput = {
            AND: [
                search
                    ? {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { artist: { name: { contains: search, mode: 'insensitive' } } },
                        ],
                    }
                    : {},
                artistName ? { artist: { name: { contains: artistName, mode: 'insensitive' } } } : {},
            ],
        };

        return prisma.product.findMany({
            where,
            include: {
                artist: true,
                images: {
                    orderBy: { created_at: 'asc' }
                }
            },
            orderBy: { created_at: 'desc' },
            skip,
            take,
        }) as unknown as Product[];
    },

    count: async (params: { search?: string; artistName?: string }): Promise<number> => {
        const { search, artistName } = params;

        const where: Prisma.ProductWhereInput = {
            AND: [
                search
                    ? {
                        OR: [
                            { title: { contains: search, mode: 'insensitive' } },
                            { artist: { name: { contains: search, mode: 'insensitive' } } },
                        ],
                    }
                    : {},
                artistName ? { artist: { name: { contains: artistName, mode: 'insensitive' } } } : {},
            ],
        };

        return prisma.product.count({ where });
    },

    findById: async (id: string): Promise<Product | null> => {
        return prisma.product.findUnique({
            where: { id },
            include: {
                artist: true,
                images: {
                    orderBy: { created_at: 'asc' }
                }
            },
        }) as unknown as Product | null;
    },

    create: async (data: CreateProductDto): Promise<Product> => {
        const artist = await prisma.artist.findUnique({
            where: { name: data.artistName },
        });

        if (!artist) {
            throw new Error('ARTIST_NOT_FOUND');
        }

        try {
            return (await prisma.product.create({
                data: {
                    title: data.title,
                    artist: { connect: { id: artist.id } },
                    images: {
                        connectOrCreate: {
                            where: {
                                url_artist_id: {
                                    url: data.image.url,
                                    artist_id: artist.id,
                                }
                            },
                            create: {
                                url: data.image.url,
                                width: data.image.width,
                                height: data.image.height,
                                size_bytes: data.image.sizeBytes,
                                mime_type: data.image.mimeType,
                                artist: { connect: { id: artist.id } },
                            }
                        }
                    }
                },
                include: {
                    artist: true,
                    images: true
                },
            })) as unknown as Product;
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new Error('PRODUCT_ALREADY_EXISTS', { cause: err });
            }
            throw err;
        }
    },

    update: async (id: string, data: UpdateProductDto): Promise<Product> => {
        const updateData: Prisma.ProductUpdateInput = {
            ...(data.title !== undefined && { title: data.title }),
        };

        let artistId: string | undefined;
        if (data.artistName !== undefined) {
            const artist = await prisma.artist.findUnique({
                where: { name: data.artistName },
            });

            if (!artist) {
                throw new Error('ARTIST_NOT_FOUND');
            }

            artistId = artist.id;
            updateData.artist = { connect: { id: artistId } };
        }

        if (data.image !== undefined) {
            // If we are updating the artist as well, or if we need to find the current artist
            if (!artistId) {
                const current = await prisma.product.findUnique({
                    where: { id },
                    select: { artist_id: true }
                });
                artistId = current?.artist_id;
            }

            updateData.images = {
                set: [], // Disconnect old images (Many-to-Many)
                connectOrCreate: {
                    where: {
                        url_artist_id: {
                            url: data.image.url,
                            artist_id: artistId!,
                        }
                    },
                    create: {
                        url: data.image.url,
                        width: data.image.width,
                        height: data.image.height,
                        size_bytes: data.image.sizeBytes,
                        mime_type: data.image.mimeType,
                        artist: { connect: { id: artistId! } },
                    }
                }
            };
        }

        try {
            return (await prisma.product.update({
                where: { id },
                data: updateData,
                include: {
                    artist: true,
                    images: true
                },
            })) as unknown as Product;
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                throw new Error('PRODUCT_ALREADY_EXISTS', { cause: err });
            }
            throw err;
        }
    },

    delete: async (id: string): Promise<Product> => {
        return prisma.product.delete({
            where: { id },
        }) as unknown as Product;
    },
};

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
                artistName ? { artist: { name: { equals: artistName, mode: 'insensitive' } } } : {},
            ],
        };

        return prisma.product.findMany({
            where,
            include: { artist: true },
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
                artistName ? { artist: { name: { equals: artistName, mode: 'insensitive' } } } : {},
            ],
        };

        return prisma.product.count({ where });
    },

    findById: async (id: string): Promise<Product | null> => {
        return prisma.product.findUnique({
            where: { id },
            include: { artist: true },
        }) as unknown as Product | null;
    },

    create: async (data: CreateProductDto): Promise<Product> => {
        return prisma.product.create({
            data: {
                title: data.title,
                cover_art_url: data.coverArtUrl,
                artist: {
                    connectOrCreate: {
                        where: { name: data.artistName },
                        create: { name: data.artistName },
                    },
                },
            },
            include: { artist: true },
        }) as unknown as Product;
    },

    update: async (id: string, data: UpdateProductDto): Promise<Product> => {
        const updateData: Prisma.ProductUpdateInput = {
            ...(data.title !== undefined && { title: data.title }),
            ...(data.coverArtUrl !== undefined && { cover_art_url: data.coverArtUrl }),
        };

        if (data.artistName !== undefined) {
            updateData.artist = {
                connectOrCreate: {
                    where: { name: data.artistName },
                    create: { name: data.artistName },
                },
            };
        }

        return prisma.product.update({
            where: { id },
            data: updateData,
            include: { artist: true },
        }) as unknown as Product;
    },

    delete: async (id: string): Promise<Product> => {
        return prisma.product.delete({
            where: { id },
        }) as unknown as Product;
    },
};

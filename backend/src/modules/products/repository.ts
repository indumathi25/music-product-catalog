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
                            { name: { contains: search, mode: 'insensitive' } },
                            { artist_name: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {},
                artistName ? { artist_name: { equals: artistName, mode: 'insensitive' } } : {},
            ],
        };

        return prisma.product.findMany({
            where,
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
                            { name: { contains: search, mode: 'insensitive' } },
                            { artist_name: { contains: search, mode: 'insensitive' } },
                        ],
                    }
                    : {},
                artistName ? { artist_name: { equals: artistName, mode: 'insensitive' } } : {},
            ],
        };

        return prisma.product.count({ where });
    },

    findById: async (id: number): Promise<Product | null> => {
        return prisma.product.findUnique({
            where: { id },
        }) as unknown as Product | null;
    },

    create: async (data: CreateProductDto): Promise<Product> => {
        return prisma.product.create({
            data: {
                name: data.name,
                artist_name: data.artistName,
                cover_url: data.coverUrl,
            },
        }) as unknown as Product;
    },

    update: async (id: number, data: UpdateProductDto): Promise<Product> => {
        return prisma.product.update({
            where: { id },
            data: {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.artistName !== undefined && { artist_name: data.artistName }),
                ...(data.coverUrl !== undefined && { cover_url: data.coverUrl }),
            },
        }) as unknown as Product;
    },

    delete: async (id: number): Promise<Product> => {
        return prisma.product.delete({
            where: { id },
        }) as unknown as Product;
    },
};

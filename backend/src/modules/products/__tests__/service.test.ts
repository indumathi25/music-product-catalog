import { productService } from '../service';
import { productRepository } from '../repository';
import { AppError } from '../../../middlewares/errorHandler';

jest.mock('../repository');

const mockRepo = productRepository as jest.Mocked<typeof productRepository>;

const mockProduct = {
    id: 'uuid-1',
    title: 'Abbey Road',
    artist: { name: 'The Beatles' },
    images: [
        {
            id: 'img-1',
            url: 'http://localhost:4000/uploads/cover-test.jpg',
            alt_text: 'Cover art',
            mime_type: 'image/webp',
            size_bytes: 1000,
            width: 600,
            height: 600,
            created_at: new Date('2024-01-01'),
        }
    ],
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
};

const mockImageMetadata = {
    url: 'http://localhost:4000/uploads/cover-test.jpg',
    width: 600,
    height: 600,
    sizeBytes: 1000,
    mimeType: 'image/webp',
};

describe('productService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAll', () => {
        it('should return all products mapped to camelCase with total count', async () => {
            mockRepo.findAll.mockResolvedValue([mockProduct] as never);
            mockRepo.count.mockResolvedValue(1 as never);

            const result = await productService.getAll({});

            expect(result.total).toBe(1);
            expect(result.data).toHaveLength(1);
            expect(result.data[0]).toMatchObject({
                id: mockProduct.id,
                title: mockProduct.title,
                artistName: mockProduct.artist.name,
                images: expect.arrayContaining([
                    expect.objectContaining({ url: mockProduct.images[0].url })
                ]),
            });
        });
    });

    describe('getById', () => {
        it('should throw 404 when product not found', async () => {
            mockRepo.findById.mockResolvedValue(null as never);
            await expect(productService.getById('non-existent')).rejects.toThrow(AppError);
            await expect(productService.getById('non-existent')).rejects.toMatchObject({
                statusCode: 404,
                code: 'PRODUCT_NOT_FOUND',
            });
        });

        it('should return product when found', async () => {
            mockRepo.findById.mockResolvedValue(mockProduct as never);
            const result = await productService.getById(mockProduct.id);
            expect(result.id).toBe(mockProduct.id);
            expect(result.artistName).toBe(mockProduct.artist.name);
        });
    });

    describe('create', () => {
        it('should create a product and return it', async () => {
            mockRepo.create.mockResolvedValue(mockProduct as never);
            const result = await productService.create({
                title: 'Abbey Road',
                artistName: 'The Beatles',
                image: mockImageMetadata,
            });
            expect(mockRepo.create).toHaveBeenCalledTimes(1);
            expect(result.title).toBe('Abbey Road');
        });
    });

    describe('delete', () => {
        it('should throw 404 when deleting non-existent product', async () => {
            mockRepo.findById.mockResolvedValue(null as never);
            await expect(productService.delete('non-existent')).rejects.toMatchObject({
                statusCode: 404,
            });
        });

        it('should delete product when it exists', async () => {
            mockRepo.findById.mockResolvedValue(mockProduct as never);
            mockRepo.delete.mockResolvedValue(mockProduct as never);
            await expect(productService.delete(mockProduct.id)).resolves.toBeUndefined();
            expect(mockRepo.delete).toHaveBeenCalledWith(mockProduct.id);
        });
    });
});

import { MockUrlRepository } from '../../../../__mocks__/mock-url.repo';
import { UrlService } from '@/application/services/url.service';
import { AppError } from '@/shared/errors/app-error';
import { Request, Response, NextFunction } from 'express';
import { UrlController } from '@/interfaces/http/controller/url.controller';

describe.only('UrlController', () => {
    let urlController: UrlController;
    let urlService: UrlService;
    let urlRepository: MockUrlRepository;

    beforeAll(() => {
        urlRepository = new MockUrlRepository();
        urlService = new UrlService(urlRepository);
        urlController = new UrlController(urlService);
    });

    afterAll(() => {
        urlRepository.clearMockDb();
    });

    describe('createUrl', () => {
        test('should create a new URL', async () => {
            const userId = crypto.randomUUID();
            const newUrlData = {
                url: 'https://example.com',
                short_code: 'exmpl',
            };

            const req = {
                body: newUrlData,
                user: { id: userId },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await urlController.createUrl(req as any, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Url created successfully' }));
        });

        test('should handle validation errors', async () => {
            const req = {
                body: {
                },
                user: { id: crypto.randomUUID() },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await urlController.createUrl(req as any, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
        });

        test('should handle unauthorized errors', async () => {
            const req = {
                body: { url: 'https://example.com', short_code: 'exmpl' },
                user: null,
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await urlController.createUrl(req as any, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
        });
    });

    describe('getUrls', () => {
        test('should get URLs for a user', async () => {
            const userId = crypto.randomUUID();

            const req = {
                user: { id: userId },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await urlController.getUrls(req as any, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Urls fetched successfully' }));
        });

        test('should handle unauthorized errors', async () => {
            const req = {
                user: null,
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await urlController.getUrls(req as any, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
        });
    });

    describe('deleteUrl', () => {
        test('should delete a URL', async () => {
            const urlId = crypto.randomUUID();

            const mockUrlService = {
                deleteUrl: jest.fn().mockResolvedValue(undefined),
            };

            const urlController = new UrlController(mockUrlService as unknown as UrlService);

            const req = {
                params: { id: urlId },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                end: jest.fn(),
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await urlController.deleteUrl(req as any, res, next);

            expect(mockUrlService.deleteUrl).toHaveBeenCalledWith(urlId);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalled();
        });

        test('should handle errors', async () => {
            const urlId = crypto.randomUUID();

            const mockUrlService = {
                deleteUrl: jest.fn().mockRejectedValue(new Error('Mocked error')),
            };

            const urlController = new UrlController(mockUrlService as unknown as UrlService);

            const req = {
                params: { id: urlId },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                end: jest.fn(),
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await urlController.deleteUrl(req as any, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
        });
    });

    describe('getUrlByShortCode', () => {
        test('should redirect to the original URL by short code', async () => {
            const shortCode = 'test123';

            const mockUrlService = {
                getUrlByShortUrl: jest.fn().mockResolvedValue({
                    id: crypto.randomUUID(),
                    short_code: shortCode,
                    url: 'https://example.com', // Ensure it matches `url.url` in the controller
                }),
            };

            const urlController = new UrlController(mockUrlService as unknown as UrlService);

            const req = {
                params: { short_code: shortCode },
            } as unknown as Request;

            const res = {
                redirect: jest.fn(), // Mock `redirect`
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await urlController.getUrlByShortCode(req, res, next);

            expect(mockUrlService.getUrlByShortUrl).toHaveBeenCalledWith(shortCode);
            expect(res.redirect).toHaveBeenCalledWith('https://example.com'); // Expect redirect call
        });
        test('should handle errors', async () => {
            const shortCode = crypto.randomUUID();

            const mockUrlService = {
                getUrlByShortUrl: jest.fn().mockRejectedValue(new AppError('Mocked error', 400, 'mock_error')),
            };

            const urlController = new UrlController(mockUrlService as unknown as UrlService);

            const req = {
                params: { short_code: shortCode },
            } as unknown as Request;

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            } as unknown as Response;

            const next = jest.fn() as NextFunction;

            await urlController.getUrlByShortCode(req as any, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(AppError));
        });
    });
});
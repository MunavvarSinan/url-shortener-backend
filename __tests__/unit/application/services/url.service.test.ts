// import { test, expect, beforeAll, afterAll, describe } from 'bun:test';
import { UrlService } from '@/application/services/url.service';
import { MockUrlRepository } from '../../../__mocks__/mock-url.repo';
import { NewUrl } from '@/infrastructure/database/schema';
import { AppError } from '@/shared/errors/app-error';

describe('UrlService (Mocked)', () => {
    let urlService: UrlService;
    let urlRepository: MockUrlRepository;

    beforeAll(() => {
        urlRepository = new MockUrlRepository();
        urlService = new UrlService(urlRepository);
        urlRepository.clearMockDb();
    });

    afterAll(() => {
        urlRepository.clearMockDb();
    });

    describe('createUrl', () => {
        test('should create a new URL', async () => {
            const userId = crypto.randomUUID();

            const newUrlData: NewUrl = {
                url: 'https://example.com',
                short_code: 'exmpl',
                user_id: userId,
            };

            const result = await urlService.createUrl(newUrlData);

            expect(result.url).toBe(newUrlData.url);
            expect(result.short_code).not.toBe(newUrlData.short_code);
            expect(result.user_id).toBe(newUrlData.user_id);
            expect(result.id).toBeDefined();
        });

        test('should create a new URL even if the user does not exist', async () => {
            const newUrlData: NewUrl = {
                url: 'https://example.com',
                short_code: 'exmpl',
                user_id: crypto.randomUUID(),
            };

            const result = await urlService.createUrl(newUrlData);

            expect(result.url).toBe(newUrlData.url);
            expect(result.short_code).not.toBe(newUrlData.short_code);
            expect(result.user_id).toBe(newUrlData.user_id);
            expect(result.id).toBeDefined();
        });
    });

    describe('getUrls', () => {
        test('should retrieve all URLs for a user', async () => {
            const userId = crypto.randomUUID();

            await urlRepository.createUrl({ url: 'https://example.com/1', short_code: 'exmpl1', user_id: userId });
            await urlRepository.createUrl({ url: 'https://example.com/2', short_code: 'exmpl2', user_id: userId });

            const urls = await urlService.getUrls(userId);
            expect(urls.length).toBe(2);
        });
    });

    describe('deleteUrl', () => {
        test('should delete a URL', async () => {
            const userId = crypto.randomUUID();

            const createdUrl = await urlRepository.createUrl({ url: 'https://example.com', short_code: 'exmpl', user_id: userId });

            await urlService.deleteUrl(createdUrl.id);
            const urls = await urlService.getUrls(userId);
            expect(urls.length).toBe(0);
        });

        test('should throw an error if URL does not exist', async () => {
            await expect(urlService.deleteUrl(crypto.randomUUID())).rejects.toThrow(
                new AppError('Url not found', 404, 'url_not_found'),
            );
        });
    });

    describe('getUrlByShortUrl', () => {
        test('should retrieve a URL by short_code', async () => {
            const userId = crypto.randomUUID();

            const shortUrl = 'test123';
            await urlRepository.createUrl({ url: 'https://example.com', short_code: shortUrl, user_id: userId });

            const result = await urlService.getUrlByShortUrl(shortUrl);
            expect(result).not.toBeNull();
            expect(result?.short_code).toBe(shortUrl);
        });

        test('should throw an error if URL does not exist', async () => {
            await expect(urlService.getUrlByShortUrl('nonexistent')).rejects.toThrow(
                new AppError('Url not found', 404, 'url_not_found'),
            );
        });
    });
});
// import { test, expect, beforeAll, afterAll, describe } from 'bun:test';
import { MockUrlRepository } from '../../../../__mocks__/mock-url.repo';
import type { NewUrl } from '@/infrastructure/database/schema';

describe('UrlRepository (Mocked)', () => {
    let urlRepository: MockUrlRepository;

    beforeAll(() => {
        urlRepository = new MockUrlRepository();
        urlRepository.clearMockDb();
    });

    afterAll(() => {
        urlRepository.clearMockDb();
    });

    describe('createUrl', () => {
        test('should create a new URL', async () => {
            const newUrl: NewUrl = {
                url: 'https://example.com',
                short_code: 'exmpl',
                user_id: crypto.randomUUID(),
            };
            const result = await urlRepository.createUrl(newUrl);

            expect(result).toMatchObject(newUrl);
            expect(result.id).toBeDefined();
        });
    });

    describe('getAllUrls', () => {
        test('should retrieve all URLs for a user', async () => {
            const userId = crypto.randomUUID();
            await urlRepository.createUrl({ url: 'https://example.com/1', short_code: 'exmpl1', user_id: userId });
            await urlRepository.createUrl({ url: 'https://example.com/2', short_code: 'exmpl2', user_id: userId });

            const urls = await urlRepository.getAllUrls(userId);
            expect(urls.length).toBe(2);
        });
    });

    describe('getUrlByShortUrl', () => {
        test('should retrieve a URL by short_code', async () => {
            const shortUrl = 'test123';
            await urlRepository.createUrl({ url: 'https://example.com', short_code: shortUrl, user_id: crypto.randomUUID() });

            const result = await urlRepository.getUrlByShortUrl(shortUrl);
            expect(result).not.toBeNull();
            expect(result?.short_code).toBe(shortUrl);
        });
    });

    describe('deleteUrl', () => {
        test('should delete a URL', async () => {
            const createdUrl = await urlRepository.createUrl({ url: 'https://example.com', short_code: 'exmpl', user_id: crypto.randomUUID() });

            await urlRepository.deleteUrl(createdUrl.id);
            const urls = await urlRepository.getAllUrls(createdUrl.user_id);
            expect(urls.length).toBe(0);
        });
    });
});
import { MockUrlRepository } from '../../../../__mocks__/mock-url.repo';
import type { NewUrl } from '@/infrastructure/database/schema';

describe('UrlRepository (Mocked)', () => {
    let urlRepository: MockUrlRepository;

    beforeEach(() => {
        urlRepository = new MockUrlRepository();
        urlRepository.clearMockDb();
    });

    test('should create a new URL', async () => {
        const newUrl: NewUrl = {
            url: 'https://example.com',
            short_url: 'exmpl',
            user_id: crypto.randomUUID(),
        };
        const result = await urlRepository.createUrl(newUrl);

        expect(result).toMatchObject(newUrl);
        expect(result.id).toBeDefined();
    });

    test('should retrieve all URLs', async () => {
        await urlRepository.createUrl({ url: 'https://example.com/1', short_url: 'exmpl1', user_id: crypto.randomUUID() });
        await urlRepository.createUrl({ url: 'https://example.com/2', short_url: 'exmpl2', user_id: crypto.randomUUID() });

        const urls = await urlRepository.getAllUrls();
        expect(urls.length).toBe(2);
    });

    test('should retrieve a URL by short_url', async () => {
        const shortUrl = 'test123';
        await urlRepository.createUrl({ url: 'https://example.com', short_url: shortUrl, user_id: crypto.randomUUID() });

        const result = await urlRepository.getUrlByShortUrl(shortUrl);
        expect(result).not.toBeNull();
        expect(result?.short_url).toBe(shortUrl);
    });

    test('should delete a URL', async () => {
        const createdUrl = await urlRepository.createUrl({ url: 'https://example.com', short_url: 'exmpl', user_id: crypto.randomUUID() });

        await urlRepository.deleteUrl(createdUrl.id);
        const urls = await urlRepository.getAllUrls();

        expect(urls.length).toBe(0);
    });
});

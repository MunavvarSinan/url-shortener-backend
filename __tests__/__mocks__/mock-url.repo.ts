import type { IUrlRepository } from '@/domain/repositories/IUrlRepository';
import type { Url, NewUrl } from '@/infrastructure/database/schema';

export class MockUrlRepository implements IUrlRepository {
    private mockDb: Url[] = [];

    async createUrl(data: NewUrl): Promise<Url> {
        const newUrl: Url = {
            ...data,
            id: crypto.randomUUID(),
            created_at: new Date(),
            updated_at: new Date(),
            visitors: 0, // Initialize visitors to 0
        };
        this.mockDb.push(newUrl);
        return newUrl;
    }

    async getAllUrls(userId: string): Promise<Url[]> {
        return this.mockDb.filter(url => url.user_id === userId);
    }

    async getUrlById(id: string): Promise<Url | null> {
        return this.mockDb.find(url => url.id === id) || null;
    }

    async getUrlByShortUrl(short_url: string): Promise<Url | null> {
        const url = this.mockDb.find(url => url.short_code === short_url);
        if (url) {
            url.visitors = (url.visitors || 0) + 1; // Increment visitors count
        }
        return url || null;
    }

    async deleteUrl(id: string): Promise<void> {
        this.mockDb = this.mockDb.filter(url => url.id !== id);
    }

    clearMockDb() {
        this.mockDb = []; // Reset database for fresh tests
    }
}
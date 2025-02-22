import type { IUrlRepository } from '@/domain/repositories/IUrlRepository';
import type { Url, NewUrl } from '@/infrastructure/database/schema';

export class MockUrlRepository implements IUrlRepository {
    private mockDb: Url[] = [];

    async createUrl(data: NewUrl): Promise<Url> {
        const newUrl = {
            ...data,
            id: crypto.randomUUID(),
            created_at: new Date(),
            updated_at: new Date(),
        };
        this.mockDb.push(newUrl);
        return newUrl;
    }

    async getAllUrls(): Promise<Url[]> {
        return [...this.mockDb]; // Return a copy to prevent modification in tests
    }

    async getUrlByShortUrl(short_url: string): Promise<Url | null> {
        return this.mockDb.find((url) => url.short_url === short_url) || null;
    }

    async deleteUrl(id: string): Promise<void> {
        this.mockDb = this.mockDb.filter((url) => url.id !== id);
    }

    clearMockDb() {
        this.mockDb = []; // Reset database for fresh tests
    }
}

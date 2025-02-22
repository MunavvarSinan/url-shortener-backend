import type { IUrlRepository } from '@/domain/repositories/IUrlRepository';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { urls, type NewUrl, type Url } from '../schema';

export class UrlRepository implements IUrlRepository {
  async createUrl(data: NewUrl): Promise<Url> {
    const [url] = await db.insert(urls).values(data).returning().execute();
    return url;
  }

  getAllUrls(): Promise<Url[]> {
    return db.select().from(urls).execute();
  }

  async deleteUrl(id: string): Promise<void> {
    await db.delete(urls).where(eq(urls.id, id)).execute();
  }
}

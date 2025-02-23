import type { IUrlRepository } from '@/domain/repositories/IUrlRepository';
import { eq } from 'drizzle-orm';
import { db } from '..';
import { urls, type NewUrl, type Url } from '../schema';

export class UrlRepository implements IUrlRepository {
  async createUrl(data: NewUrl): Promise<Url> {
    const [url] = await db.insert(urls).values(data).returning().execute();
    return url;
  }

  getAllUrls(userId: string): Promise<Url[]> {
    return db.select().from(urls).where(eq(urls.user_id, userId)).execute();
  }

  async deleteUrl(id: string): Promise<void> {
    await db.delete(urls).where(eq(urls.id, id)).execute();
  }
  async getUrlById(id: string): Promise<Url | null> {
    const url = await db.select().from(urls).where(eq(urls.id, id)).execute();
    return url.length > 0 ? url[0] : null;
  }
  async getUrlByShortUrl(short_url: string): Promise<Url | null> {
    const url = await db
      .select()
      .from(urls)
      .where(eq(urls.short_code, short_url))
      .execute()
      .then((urls) => urls[0] || null);

    if (url) {
      await db
        .update(urls)
        .set({ visitors: url?.visitors ? url.visitors + 1 : 1 })
        .where(eq(urls.short_code, short_url))
        .execute();
    }

    return url;
  }
}

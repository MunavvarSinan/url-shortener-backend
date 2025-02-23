import type { NewUrl, Url } from '@/infrastructure/database/schema';

export interface IUrlRepository {
  createUrl(data: NewUrl): Promise<Url>;
  getAllUrls(userId: string): Promise<Url[]>;
  deleteUrl(id: string): Promise<void>;
  getUrlByShortUrl(short_url: string): Promise<Url | null>;
  getUrlById(id: string): Promise<Url | null>;
}

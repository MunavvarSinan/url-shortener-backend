import type { NewUrl, Url } from '@/infrastructure/database/schema';

export interface IUrlRepository {
  createUrl(data: NewUrl): Promise<Url>;
  getAllUrls(): Promise<Url[]>;
  deleteUrl(id: string): Promise<void>;
}

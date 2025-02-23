import { Url } from '@/domain/entities';
import type { IUrlRepository } from '@/domain/repositories/IUrlRepository';
import { NewUrl } from '@/infrastructure/database/schema';
import { AppError } from '@/shared/errors/app-error';
import crypto from 'crypto';

export class UrlService {
  constructor(private readonly urlRepository: IUrlRepository) {}

  private generateShortCode(): string {
    const randomStr = crypto.randomBytes(2).toString('hex');
    const timestamp = Date.now().toString(36).slice(-2);
    return `${randomStr}${timestamp}`;
  }

  async createUrl(data: NewUrl): Promise<Url> {
    const shortCode = this.generateShortCode();

    const url = await this.urlRepository.createUrl({ ...data, short_code: shortCode });

    return new Url(
      url.id,
      url.url,
      url.short_code,
      url.user_id,
      url.visitors ?? 0,
      url.created_at,
      url.updated_at,
    );
  }

  async getUrls(userId: string): Promise<Url[]> {
    const urls = await this.urlRepository.getAllUrls(userId);
    return urls.map(
      (url) =>
        new Url(
          url.id,
          url.url,
          url.short_code,
          url.user_id,
          url.visitors ?? 0,
          url.created_at,
          url.updated_at,
        ),
    );
  }
  async deleteUrl(urlId: string): Promise<void> {
    const url = await this.urlRepository.getUrlById(urlId);
    if (!url) {
      throw new AppError('Url not found', 404, 'url_not_found');
    }
    await this.urlRepository.deleteUrl(urlId);
  }

  async getUrlByShortUrl(short_url: string): Promise<Url | null> {
    const url = await this.urlRepository.getUrlByShortUrl(short_url);
    if (!url) {
      throw new AppError('Url not found', 404, 'url_not_found');
    }
    return new Url(
      url.id,
      url.url,
      url.short_code,
      url.user_id,
      url.visitors ?? 0,
      url.created_at,
      url.updated_at,
    );
  }
}

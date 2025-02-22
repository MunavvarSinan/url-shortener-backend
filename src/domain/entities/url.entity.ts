// src/domain/entities/Url.ts
export class Url {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly shortUrl: string,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.url.startsWith('http')) throw new Error('Invalid URL format.');
  }
}

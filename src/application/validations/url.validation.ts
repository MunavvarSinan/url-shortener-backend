import { z } from 'zod';

export const urlValidation = {
  createUrl: {
    body: z.object({
      url: z.string({ required_error: 'Url is required' }).min(1, 'Url is required'),
    }),
  },
  getUrlByShortCode: {
    params: z.object({
      short_code: z
        .string({ required_error: 'Short code is required' })
        .min(1, 'Short code is required'),
    }),
  },
};

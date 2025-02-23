import { logger } from '@/infrastructure/logger';
import { createServer } from '@/infrastructure/server';
import { Application } from 'express';
import request from 'supertest';

describe('Server Integration Tests', () => {
    let app: Application;

    beforeAll(async () => {
        app = await createServer();
    });

    afterAll(() => {
        logger.info('Server integration tests completed.');
    });

    test('GET /api/v1/health should return status OK', async () => {
        const response = await request(app).get('/api/v1/health');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: 'OK',
            timestamp: expect.any(String),
        });
    });

    test('GET /nonexistent-route should return 404', async () => {
        const response = await request(app).get('/nonexistent-route');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            status: 'error', // Updated to match the actual response
            message: 'Resource not found',
        });
    });

});
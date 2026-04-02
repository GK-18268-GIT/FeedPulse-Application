import { jest } from '@jest/globals';

jest.mock('../services/gemini.service.js', () => ({
  analyzeFeedbackWithGemini: jest.fn<(title: string, description: string) => Promise<any>>().mockResolvedValue({
    category: 'Bug',
    sentiment: 'Negative',
    priority_score: 8,
    summary: 'Mocked AI summary',
    tags: ['Test']
  })
}));

import request from 'supertest';
import app from '../tests/app.js';

/* Auth Tests */

describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@feedpulse.com',
                password: 'admin123'
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.token).toBeDefined();
    });
    
    it('should not login with invalid credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'wrong@feedpulse.com',
                password: 'wrong123'
            });

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    it('should not login with missing credentials', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

});

/* Feedback Tests */
describe('POST /api/feedback', () => {
    it('should create a feedback with valid data', async () => {
        const response = await request(app)
            .post('/api/feedback')
            .send({
                title: "Test the feedback title",
                description: "Using more that 20 characters to test description",
                category: 'Bug'
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.title).toBe("Test the feedback title");
        expect(response.body.data.description).toBe("Using more that 20 characters to test description");
        expect(response.body.data.category).toBe("Bug");
        expect(response.body.data.status).toBe('New');
        expect(response.body.data.ai_processed).toBe(false);
    });

    it('should not create a feedback with empty data', async () => {
        const response = await request(app)
            .post('/api/feedback')
            .send({
                title: "",
                description: "Using more that 20 characters to test description",
                category: 'Bug'
            });
        
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });

    it('should not create a feedback with missing required fields', async () => {
        const response = await request(app)
            .post('/api/feedback')
            .send({
                title: "Create a feedback with title, without description and category"
            });
        
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
    });
});

/* Auth Middleware Test */
describe('GET /api/feedback - auth protected', () => {
    it('should reject the request without token', async () => {
        const response = await request(app)
            .get('/api/feedback');
        
        expect(response.status).toBe(401);
    });

    it('should reject the request with invalid token', async () => {
        const response = await request(app)
            .get('/api/feedback')
            .set('Authorization', 'Bearer invalidToken123')
        
        expect(response.status).toBe(401)
    });

    it('should allow the request with valid token', async () => {
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@feedpulse.com',
                password: 'admin123'
            });
        
        const validToken = loginResponse.body.data.token

        const response = await request(app)
            .get('/api/feedback')
            .set('Authorization', `Bearer ${validToken}`)
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true)
    });

});

/* Status Update Test */
describe('PATH /api/feedback/:id', () => {
    it('should update feedback status', async() => {
        const createResponse = await request(app)
            .post('/api/feedback')
            .send({
                title: "Test the feedback title",
                description: "Using more that 20 characters to test description",
                category: 'Bug'
            });
        
        const feedbackId = createResponse.body.data._id;

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@feedpulse.com',
                password: 'admin123'
            });

        const validToken = loginResponse.body.data.token
        
        const response = await request(app)
            .patch(`/api/feedback/${feedbackId}`)
            .set('Authorization', `Bearer ${validToken}`)
            .send({
                status: 'In Review'
            })
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true)
        expect(response.body.data.status).toBe('In Review');
    });

    it('should return 404 for not found feedback', async() => {
        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'admin@feedpulse.com',
                password: 'admin123'
            });

        const validToken = loginResponse.body.data.token;
        
        const response = await request(app)
        .patch('/api/feedback/000000000000000000000000')
            .set('Authorization', `Bearer ${validToken}`)
            .send({ 
                status: 'Resolved' 
            });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);

    });

});

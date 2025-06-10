import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('AuthController (integration)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    const testUser = {
        email: `testuser${Date.now()}@example.com`, // unique email for each test run
        password: 'password123',
        name: 'Test User',
        role: 'USER', // if needed by your DTO
    };

    it('POST /auth/register → should register a new user', async () => {
        await request(app.getHttpServer())
            .post('/auth/register')
            .send(testUser)
            .expect(201);
    });

    it('POST /auth/login → should log in the user', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password,
            })
            .expect(200);

        // check if cookie was set
        const rawSetCookie = response.headers['set-cookie'];
        const setCookie = Array.isArray(rawSetCookie) ? rawSetCookie : [rawSetCookie];
      
        expect(setCookie.some(cookie => cookie.includes('accessToken'))).toBe(true);
        expect(setCookie.some(cookie => cookie.includes('refreshToken'))).toBe(true);
    });

    it('POST /auth/login → should fail with wrong password', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword',
            })
            .expect(401);

        expect(response.body.message).toEqual('Invalid credentials');
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module'; // Adjust path if needed
import { PrismaService } from '../../prisma/prisma.service';

describe('SolutionsController (integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;


  // Store created solution id for later tests
  let createdSolutionId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Your main app module
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);

    await getAuthToken();
  });

  afterAll(async () => {
    await app.close();
  });

  // Method to get authentication token
  async function getAuthToken() {
    // Option 1: Login with existing test user
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john5@test.com',
        password: 'Ab123&'
      });
    
    authToken = loginResponse.body.accessToken;
    console.log(authToken)
  }

  const testSolution = {
    name: 'Test Solution',
    description: 'Test Description',
    kind: 'simpleSolution',
    location: 'Test Location',
    mode: 'createFromNew',
    status: 'draft',
    defaultSectionId: '973f438f-506b-4def-b4ca-2aa1462410a0',
    defaultSectionName: 'Section',
    defaultSubSectionId: '8a73c2ac-213a-4beb-94d3-dec085a6b245',
    defaultSubSectionName: 'Subsection',
    defaultEventId: '41787933-2533-4947-99e1-3a38b7625b0d',
    defaultEventName: 'Event',
    content: 'Some content',
    problem: 'Problem description',
    title: 'Problem title',
    email: 'test@example.com',
    solutionDetails: {
      title: 'Solution title',
      description: 'Solution description',
      rootCause: 'Root cause',
      countermeasure: 'Countermeasure',
    },
  };

  it('POST /solutions → should create a solution', async () => {
    const response = await request(app.getHttpServer())
      .post('/solutions')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testSolution)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe(testSolution.name);

    createdSolutionId = response.body.id;
  });

  it('GET /solutions → should return array of solutions', async () => {
    const response = await request(app.getHttpServer())
      .get('/solutions')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET /solutions/:id → should return one solution', async () => {
    const response = await request(app.getHttpServer())
      .get(`/solutions/${createdSolutionId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdSolutionId);
    expect(response.body.name).toBe(testSolution.name);
  });
});

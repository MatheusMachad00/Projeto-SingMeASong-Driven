import app from "../../src/app";
import supertest from 'supertest';
import { prisma } from '../../src/database';
import {
  createNewRecommendation,
  createNewRecommendationWrongLink,
  createNewRecommendationMissingTitle,
  createRecommendationAndGiveUpvote
} from '../factories/recommendationFactory'
import { createTenRecommendations } from '../factories/scenarioFactory'

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "recommendations"`;
});

const server = supertest(app);

describe('Test POST routes', () => {
  it('Create a new recommendation, expect status code 201', async () => {
    const recommendation = await createNewRecommendation();
    const result = await server.post("/recommendations/").send(recommendation);
    expect(result.status).toBe(201);
  });

  it('Try to create a new recommendation with same title, expect status code 409', async () => {
    const recommendation = await createNewRecommendation();
    await server.post("/recommendations/").send(recommendation);
    const result = await server.post("/recommendations/").send(recommendation);
    expect(result.status).toBe(409);
  });

  it('Try to create a new recommendation with missing data, expect status code 422', async () => {
    const recommendation = await createNewRecommendationMissingTitle();
    const result = await server.post("/recommendations/").send(recommendation);
    expect(result.status).toBe(422);
  });

  it('Try to create a new recommendation with wrong URL, expect status code 422', async () => {
    const recommendation = await createNewRecommendationWrongLink();
    const result = await server.post("/recommendations/").send(recommendation);
    expect(result.status).toBe(422);
  });

  it('Try to upvote a recommendation, expect status code 201', async () => {
    const recommendation = await createNewRecommendation();
    await server.post("/recommendations/").send(recommendation);
    const { id } = await prisma.recommendation.findUnique({ where: { name: recommendation.name } });
    const result = await server.post(`/recommendations/${id}/upvote`).send();
    expect(result.status).toBe(200);
  });

  it('Try to upvote a recommendation with wrong ID, expect status code 404', async () => {
    const result = await server.post(`/recommendations/710/upvote`).send();
    expect(result.status).toBe(404);
  });

  it('Try to downvote a recommendation, expect status code 201', async () => {
    const recommendation = await createNewRecommendation();
    await server.post("/recommendations/").send(recommendation);
    const { id } = await prisma.recommendation.findUnique({ where: { name: recommendation.name } });
    const result = await server.post(`/recommendations/${id}/downvote`).send();
    expect(result.status).toBe(200);
  });

  it('Try to downvote a recommendation with wrong ID, expect status code 404', async () => {
    const result = await server.post(`/recommendations/710/downvote`).send();
    expect(result.status).toBe(404);
  });

  it('Try to downvote a recommendation with 5 downvotes, expect status code 200 and recommendation deleted', async () => {
    const recommendation = await createNewRecommendation();
    await server.post("/recommendations/").send(recommendation);
    const { id } = await prisma.recommendation.findUnique({ where: { name: recommendation.name } });
    for (let i = 1; i <= 6; i++) {
      await server.post(`/recommendations/${id}/downvote`).send();
    };
    const result = await prisma.recommendation.findUnique({ where: { name: recommendation.name } });
    console.log(result)
    expect(result).toBeNull();
  });
});

describe('Test GET routes', () => {
  it('Get the last 10 recommendations, expect 200 and array of objects with 10 items', async () => {
    await createTenRecommendations();
    const result = await server.get("/recommendations/");
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
    expect(result.body.length).toBe(10);

  });

  it('Get recommendation by ID, expect 200 and object', async () => {
    await createTenRecommendations();
    const recommendation = await createNewRecommendation();
    await server.post("/recommendations/").send(recommendation);
    const { id } = await prisma.recommendation.findUnique({ where: { name: recommendation.name } });
    const result = await server.get(`/recommendations/${id}`);
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });

  it('Try to get random recommendation without no recommendation in database', async () => {
    
  });

  it('Get top 10 recommendations with most upvotes', async () => {
    for (let i = 0; i < 10; i++) {
      await createRecommendationAndGiveUpvote(i);
    };
    const result = await server.get(`/recommendations/top/${10}`);
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
    expect(result.body.length).toBe(10);
  });

  it('Get top 20 recommendations with most upvotes', async () => {
    for (let i = 0; i < 20; i++) {
      await createRecommendationAndGiveUpvote(i);
    };
    const result = await server.get(`/recommendations/top/${20}`);
    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
    expect(result.body.length).toBe(20);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
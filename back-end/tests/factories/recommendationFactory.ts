import { faker } from '@faker-js/faker'
import { prisma } from '../../src/database'
import { CreateRecommendationData } from '../../src/services/recommendationsService'
import { recommendationRepository } from "../../src/repositories/recommendationRepository";

export async function createNewRecommendation() {
  return {
    name: "Kodak Black - Super Gremlin",
    youtubeLink: "https://www.youtube.com/watch?v=kiB9qk4gnt4"
  }
};

export async function createNewRecommendationWithRandomName() {
  return {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/watch?v=kiB9qk4gnt4"
  }
}

export async function createNewRecommendationWrongLink() {
  return {
    name: "Kodak Black - Super Gremlin",
    youtubeLink: "www.google.com.br"
  }
};

export async function createNewRecommendationMissingTitle() {
  return {
    name: "",
    youtubeLink: "https://www.youtube.com/watch?v=kiB9qk4gnt4"
  }
};

export async function createRecommendationAndGiveUpvote(upvotes: number) {
  const obj: CreateRecommendationData = {
    name: faker.music.songName(),
    youtubeLink: "https://www.youtube.com/watch?v=kiB9qk4gnt4"
  };

  await prisma.recommendation.create({ data: obj });
  const { id } = await prisma.recommendation.findUnique({ where: { name: obj.name } });
  for (let i = 0; i <= upvotes; i++) {
    await recommendationRepository.updateScore(id, "increment");
  };
};
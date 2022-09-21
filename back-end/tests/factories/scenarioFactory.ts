import { createNewRecommendationWithRandomName } from './recommendationFactory'
import { CreateRecommendationData } from '../../src/services/recommendationsService'
import { recommendationService } from '../../src/services/recommendationsService'

export async function createTenRecommendations() {
  for (let i = 1; i <= 10; i++) {
    const recommendation: CreateRecommendationData = await createNewRecommendationWithRandomName();
    await recommendationService.insert(recommendation);
  };
};

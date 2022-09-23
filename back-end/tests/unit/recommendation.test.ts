import { jest } from "@jest/globals";
import { recommendationService } from '../../src/services/recommendationsService';
import { createNewRecommendation } from '../factories/recommendationFactory';
import { CreateRecommendationData } from '../../src/services/recommendationsService'
import { recommendationRepository } from '../../src/repositories/recommendationRepository'

describe('Recommendation unit test', () => {
  it('Test insert function', async () => {
    const recommendation: CreateRecommendationData = await createNewRecommendation();
    jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce(null);
    jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();

    await recommendationService.insert(recommendation);
    expect(recommendationRepository.findByName).toBeCalled();
    expect(recommendationRepository.create).toBeCalled();
  });

  it('Try to create a new recommendation with same name', async () => {
    const recommendation = {
      id: 1,
      name: "Kodak Black - Super Gremlin",
      youtubeLink: "https://www.youtube.com/watch?v=kiB9qk4gnt4",
      score: 0
    };
    jest.spyOn(recommendationRepository, "findByName").mockResolvedValueOnce(recommendation);

    expect(recommendationService.insert(recommendation)).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique"
    });
  });
});

describe('Upvote and Downvote unit test', () => {
  it('Test upvote function', async () => {
    const recommendation = {
      id: 1,
      name: "Kodak Black - Super Gremlin",
      youtubeLink: "https://www.youtube.com/watch?v=kiB9qk4gnt4",
      score: 0
    };
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendation);
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce((): any => { });

    await recommendationService.upvote(recommendation.id)
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
  });

  it('Test upvote with wrong ID', async () => {
    const recommendationId = 710;
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    expect(recommendationService.upvote(recommendationId)).rejects.toEqual({
      type: "not_found",
      message: ""
    });
  });

  it('Test downvote function', async () => {
    const recommendation = {
      id: 1,
      name: "Kodak Black - Super Gremlin",
      youtubeLink: "https://www.youtube.com/watch?v=kiB9qk4gnt4",
      score: 0
    };

    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendation);
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce((): any => {
      return {
        id: recommendation.id,
        name: recommendation.name,
        youtubeLink: recommendation.youtubeLink,
        score: -1
      }
    });
    jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce((): any => { })

    await recommendationService.downvote(recommendation.id)
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).not.toBeCalledTimes(1);
  });

  it('Test downvote with wrong ID', async () => {
    const recommendationId = 710;
    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

    expect(recommendationService.downvote(recommendationId)).rejects.toEqual({
      type: "not_found",
      message: ""
    });
  });

  it('Test downvote with more than 5 downvotes', async () => {
    const recommendation = {
      id: 1,
      name: "Kodak Black - Super Gremlin",
      youtubeLink: "https://www.youtube.com/watch?v=kiB9qk4gnt4",
      score: 0
    };

    jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(recommendation);
    jest.spyOn(recommendationRepository, 'updateScore').mockImplementationOnce((): any => {
      return {
        id: recommendation.id,
        name: recommendation.name,
        youtubeLink: recommendation.youtubeLink,
        score: -6
      }
    });
    jest.spyOn(recommendationRepository, 'remove').mockImplementationOnce((): any => { })

    await recommendationService.downvote(recommendation.id)
    expect(recommendationRepository.find).toBeCalled();
    expect(recommendationRepository.updateScore).toBeCalled();
    expect(recommendationRepository.remove).toBeCalledTimes(1);
  });
});

describe('Get random recommendation unit test', () => {
  it.todo('Get random recommendation');
});

describe('Get and get top recommendations unit test', () => {
  it('Get all recommendations', async () => {
    const recommendations = [{
      id: 1,
      name: "Kodak Black - Super Gremlin",
      youtubeLink: "https://www.youtube.com/watch?v=kiB9qk4gnt4",
      score: 10
    },
    {
      id: 2,
      name: "Kodak Black - Skrilla",
      youtubeLink: "https://www.youtube.com/watch?v=SmwmZfMooSo",
      score: 100
    },
    {
      id: 3,
      name: "Kodak Black - No Flockin",
      youtubeLink: "https://www.youtube.com/watch?v=UE_-obgiWm0",
      score: 1000
    },
    ];

    jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce(recommendations);

    await recommendationService.get();
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
  });

  it('Get top recommendations', async () => {
    const recommendations = [{
      id: 1,
      name: "Kodak Black - Super Gremlin",
      youtubeLink: "https://www.youtube.com/watch?v=kiB9qk4gnt4",
      score: 10
    },
    {
      id: 2,
      name: "Kodak Black - Skrilla",
      youtubeLink: "https://www.youtube.com/watch?v=SmwmZfMooSo",
      score: 100
    },
    {
      id: 3,
      name: "Kodak Black - No Flockin",
      youtubeLink: "https://www.youtube.com/watch?v=UE_-obgiWm0",
      score: 1000
    },
    ];

    jest.spyOn(recommendationRepository, 'getAmountByScore').mockResolvedValueOnce(recommendations);
    
    await recommendationService.getTop(3);
    /* const result = await recommendationService.getTop(2);
    console.log(result) */
    expect(recommendationRepository.getAmountByScore).toBeCalled();
    /* expect(result.length).toBe(2); */
  });
});
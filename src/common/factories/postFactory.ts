import { Faker, en } from '@faker-js/faker';
import { CreatePostRequest } from '../../api/models/post.model';

type PostFactoryOptions = {
  seed?: number;
};

function createFactoryFaker(seed?: number): Faker {
  const factoryFaker = new Faker({ locale: [en] });

  if (seed !== undefined) {
    factoryFaker.seed(seed);
  }

  return factoryFaker;
}

// Centralizes generated request data so specs stay thin and framework behavior stays deterministic.
export function buildCreatePostPayload(
  overrides: Partial<CreatePostRequest> = {},
  options: PostFactoryOptions = {}
): CreatePostRequest {
  const faker = createFactoryFaker(options.seed);

  return {
    userId: overrides.userId ?? faker.number.int({ min: 1, max: 20 }),
    title:
      overrides.title ??
      faker.lorem.sentence({ min: 4, max: 8 }).replace(/\.$/, ''),
    body:
      overrides.body ??
      faker.lorem.paragraphs({ min: 2, max: 3 }, '\n\n')
  };
}

import { test } from '@playwright/test';
import { PostsApiSteps } from '../../src/api/steps/PostsApiSteps';
import { buildCreatePostPayload } from '../../src/common/factories/postFactory';

test('Should create a post successfully', {
  tag: ['@API', '@TMS-1010']
}, async ({ request }) => {
  const postsApiSteps = new PostsApiSteps(request);
  const payload = buildCreatePostPayload();

  const response = await postsApiSteps.createPost(payload);
  await postsApiSteps.shouldHaveSuccessfulPostCreationResponse(response, payload);
});

import { test } from '@playwright/test';
import { PostsApiSteps } from '../../src/api/steps/PostsApiSteps';

test('Should get a single post successfully', {
  tag: ['@API', '@TMS-1008']
}, async ({ request }) => {
  const postsApiSteps = new PostsApiSteps(request);

  const response = await postsApiSteps.getPostById(1);
  await postsApiSteps.shouldHaveSuccessfulSinglePostResponse(response, {
    id: 1,
    userId: 1
  });
});

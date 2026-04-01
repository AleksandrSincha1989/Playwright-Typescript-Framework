import { test } from '@playwright/test';
import { PostsApiSteps } from '../../src/api/steps/PostsApiSteps';

test('Should get the posts list successfully', {
  tag: ['@API', '@TMS-1009']
}, async ({ request }) => {
  const postsApiSteps = new PostsApiSteps(request);

  const response = await postsApiSteps.getPosts();
  await postsApiSteps.shouldHaveSuccessfulPostsListResponse(response);
});

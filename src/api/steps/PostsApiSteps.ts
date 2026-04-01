import { APIRequestContext, APIResponse, expect, test } from '@playwright/test';
import { ApiClient } from '../client/ApiClient';
import { CreatePostRequest, PostResponse } from '../models/post.model';
import { frameworkConfig } from '../../config/frameworkConfigProvider';

export class PostsApiSteps {
  private readonly apiClient: ApiClient;

  constructor(request: APIRequestContext) {
    this.apiClient = new ApiClient(request, frameworkConfig.environment.apiBaseUrl);
  }

  async getPostById(postId: number): Promise<APIResponse> {
    return test.step(`Get post with id ${postId}`, async () => {
      return this.apiClient.getPostById(postId);
    });
  }

  async getPosts(): Promise<APIResponse> {
    return test.step('Get posts list', async () => {
      return this.apiClient.getPosts();
    });
  }

  async createPost(payload: CreatePostRequest): Promise<APIResponse> {
    return test.step('Create a new post', async () => {
      return this.apiClient.createPost(payload);
    });
  }

  async shouldHaveSuccessfulSinglePostResponse(
    response: APIResponse,
    expectedPost: Pick<PostResponse, 'id' | 'userId'>
  ): Promise<PostResponse> {
    return test.step('Verify single post response', async () => {
      expect(response.status()).toBe(200);

      const post = (await response.json()) as PostResponse;

      expect(typeof post).toBe('object');
      expect(post).not.toBeNull();
      expect(post.id).toBe(expectedPost.id);
      expect(post.userId).toBe(expectedPost.userId);
      expect(typeof post.title).toBe('string');
      expect(post.title.trim().length).toBeGreaterThan(0);
      expect(typeof post.body).toBe('string');
      expect(post.body.trim().length).toBeGreaterThan(0);

      return post;
    });
  }

  async shouldHaveSuccessfulPostsListResponse(response: APIResponse): Promise<PostResponse[]> {
    return test.step('Verify posts list response', async () => {
      expect(response.status()).toBe(200);

      const posts = (await response.json()) as PostResponse[];

      expect(Array.isArray(posts)).toBe(true);
      expect(posts.length).toBeGreaterThan(0);

      const ids = new Set<number>();

      for (const post of posts) {
        expect(typeof post.id).toBe('number');
        expect(typeof post.userId).toBe('number');
        expect(typeof post.title).toBe('string');
        expect(post.title.trim().length).toBeGreaterThan(0);
        expect(typeof post.body).toBe('string');
        expect(post.body.trim().length).toBeGreaterThan(0);
        ids.add(post.id);
      }

      expect(ids.size).toBe(posts.length);

      return posts;
    });
  }

  async shouldHaveSuccessfulPostCreationResponse(
    response: APIResponse,
    payload: CreatePostRequest
  ): Promise<PostResponse> {
    return test.step('Verify created post response', async () => {
      expect(response.status()).toBe(201);

      const createdPost = (await response.json()) as PostResponse;

      expect(createdPost.userId).toBe(payload.userId);
      expect(createdPost.title).toBe(payload.title);
      expect(createdPost.body).toBe(payload.body);
      expect(typeof createdPost.id).toBe('number');
      expect(createdPost.id).toBeGreaterThan(0);

      return createdPost;
    });
  }
}

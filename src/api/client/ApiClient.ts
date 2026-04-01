import { APIRequestContext, APIResponse } from '@playwright/test';
import { CreatePostRequest } from '../models/post.model';

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  async getPostById(postId: number): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/posts/${postId}`);
  }

  async getPosts(): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}/posts`);
  }

  async createPost(payload: CreatePostRequest): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}/posts`, {
      data: payload
    });
  }
}

export type PostResponse = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type CreatePostRequest = Omit<PostResponse, 'id'>;

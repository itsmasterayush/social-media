import { NextRequest } from 'next/server';
import { postSchema } from '@/utils/validators';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  incrementViews,
} from '@/services/postService';
import { successResponse, errorResponse } from '@/utils/apiResponse';
import { authenticateRequest } from '@/middleware/authMiddleware';

export async function handleGetPosts(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    const result = await getPosts({ page, limit, search });
    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch posts', 500);
  }
}

export async function handleGetPostById(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const post = await getPostById(id);
    if (!post) {
      return errorResponse('Post not found', 404);
    }
    return successResponse({ post });
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to fetch post', 500);
  }
}

export async function handleCreatePost(req: NextRequest) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return errorResponse('Unauthorized: Please log in to create posts', 401);
    }

    const body = await req.json();
    const validation = postSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || 'Invalid post content';
      return errorResponse(errorMessage, 400);
    }

    const post = await createPost(authUser.userId, validation.data);
    return successResponse({ post }, 201, 'Post created successfully');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to create post', 500);
  }
}

export async function handleUpdatePost(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return errorResponse('Unauthorized: Please log in', 401);
    }

    const { id } = await params;
    const body = await req.json();
    const validation = postSchema.safeParse(body);

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || 'Invalid post data';
      return errorResponse(errorMessage, 400);
    }

    const updatedPost = await updatePost(id, authUser.userId, validation.data);
    return successResponse({ post: updatedPost }, 200, 'Post updated successfully');
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 400;
    return errorResponse(error.message || 'Failed to update post', status);
  }
}

export async function handleDeletePost(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return errorResponse('Unauthorized: Please log in', 401);
    }

    const { id } = await params;
    await deletePost(id, authUser.userId);
    return successResponse(null, 200, 'Post deleted successfully');
  } catch (error: any) {
    const status = error.message?.includes('Unauthorized') ? 403 : 400;
    return errorResponse(error.message || 'Failed to delete post', status);
  }
}

export async function handleLikePost(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authUser = await authenticateRequest(req);
    if (!authUser) {
      return errorResponse('Unauthorized: Please log in to like posts', 401);
    }

    const { id } = await params;
    const updatedPost = await likePost(id, authUser.userId);
    return successResponse({ post: updatedPost }, 200, 'Post liked!');
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to like post', 400);
  }
}

export async function handleIncrementView(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const viewCookieKey = `viewed_post_${id}`;
    const alreadyViewed = req.cookies.get(viewCookieKey);

    if (alreadyViewed) {
      const existingPost = await getPostById(id);
      return successResponse({ post: existingPost });
    }

    const updatedPost = await incrementViews(id);
    const response = successResponse({ post: updatedPost });

    // Set a session cookie to prevent multiple increments in the same session
    response.cookies.set(viewCookieKey, 'true', {
      path: '/',
      httpOnly: true,
      maxAge: 24 * 60 * 60, // 24 hours session limit
    });

    return response;
  } catch (error: any) {
    return errorResponse(error.message || 'Failed to update post view count', 500);
  }
}

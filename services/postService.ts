import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import User from '@/models/User';
import { PostInput } from '@/utils/validators';

export async function createPost(authorId: string, input: PostInput) {
  await connectDB();

  const post = await Post.create({
    title: input.title,
    content: input.content,
    author: authorId,
  });

  const populatedPost = await Post.findById(post._id).populate('author', 'name email');
  return populatedPost;
}

export async function getPosts({
  page = 1,
  limit = 10,
  search = '',
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  await connectDB();

  const skip = (page - 1) * limit;
  const query: any = {};

  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    
    // Find matching authors if search matches author name
    const matchingAuthors = await User.find({ name: searchRegex }).select('_id');
    const authorIds = matchingAuthors.map((a) => a._id);

    query.$or = [
      { title: searchRegex },
      { content: searchRegex },
      { author: { $in: authorIds } },
    ];
  }

  const [posts, totalPosts] = await Promise.all([
    Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email')
      .lean(),
    Post.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalPosts / limit) || 1;

  return {
    posts: posts.map((p: any) => ({
      ...p,
      _id: p._id.toString(),
      author: typeof p.author === 'object' && p.author ? {
        _id: p.author._id.toString(),
        name: p.author.name,
        email: p.author.email,
      } : p.author,
      likedBy: p.likedBy ? p.likedBy.map((id: any) => id.toString()) : [],
      createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
      updatedAt: p.updatedAt ? p.updatedAt.toISOString() : new Date().toISOString(),
    })),
    totalPosts,
    totalPages,
    currentPage: page,
    limit,
  };
}

export async function getPostById(id: string) {
  await connectDB();

  const post = await Post.findById(id).populate('author', 'name email').lean();
  if (!post) return null;

  return {
    ...post,
    _id: post._id.toString(),
    author: typeof post.author === 'object' && post.author ? {
      _id: (post.author as any)._id.toString(),
      name: (post.author as any).name,
      email: (post.author as any).email,
    } : post.author,
    likedBy: post.likedBy ? post.likedBy.map((userId: any) => userId.toString()) : [],
    createdAt: post.createdAt ? post.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function updatePost(postId: string, userId: string, input: PostInput) {
  await connectDB();

  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  if (post.author.toString() !== userId) {
    throw new Error('Unauthorized: You can only update your own posts');
  }

  post.title = input.title;
  post.content = input.content;
  await post.save();

  const updated = await Post.findById(postId).populate('author', 'name email');
  return updated;
}

export async function deletePost(postId: string, userId: string) {
  await connectDB();

  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  if (post.author.toString() !== userId) {
    throw new Error('Unauthorized: You can only delete your own posts');
  }

  await Post.findByIdAndDelete(postId);
  return { success: true };
}

export async function likePost(postId: string, userId: string) {
  await connectDB();

  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('Post not found');
  }

  const alreadyLiked = post.likedBy.some((id) => id.toString() === userId);
  if (alreadyLiked) {
    throw new Error('You have already liked this post');
  }

  post.likedBy.push(userId as any);
  post.likes = post.likedBy.length;
  await post.save();

  const updated = await Post.findById(postId).populate('author', 'name email').lean();
  return {
    ...updated,
    _id: updated!._id.toString(),
    author: typeof updated!.author === 'object' && updated!.author ? {
      _id: (updated!.author as any)._id.toString(),
      name: (updated!.author as any).name,
      email: (updated!.author as any).email,
    } : updated!.author,
    likedBy: updated!.likedBy.map((id: any) => id.toString()),
    createdAt: updated!.createdAt ? updated!.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: updated!.updatedAt ? updated!.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export async function incrementViews(postId: string) {
  await connectDB();

  const post = await Post.findByIdAndUpdate(
    postId,
    { $inc: { views: 1 } },
    { new: true }
  ).populate('author', 'name email').lean();

  if (!post) return null;

  return {
    ...post,
    _id: post._id.toString(),
    author: typeof post.author === 'object' && post.author ? {
      _id: (post.author as any)._id.toString(),
      name: (post.author as any).name,
      email: (post.author as any).email,
    } : post.author,
    likedBy: post.likedBy.map((id: any) => id.toString()),
    createdAt: post.createdAt ? post.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: post.updatedAt ? post.updatedAt.toISOString() : new Date().toISOString(),
  };
}

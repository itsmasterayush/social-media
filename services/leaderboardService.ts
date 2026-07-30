import { connectDB } from '@/lib/db';
import Post from '@/models/Post';

export async function getLeaderboard() {
  await connectDB();

  const posts = await Post.aggregate([
    {
      $addFields: {
        score: { $add: [{ $ifNull: ['$likes', 0] }, { $ifNull: ['$views', 0] }] },
      },
    },
    {
      $sort: { score: -1, createdAt: -1 },
    },
    {
      $limit: 50,
    },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'authorDetails',
      },
    },
    {
      $unwind: {
        path: '$authorDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        likes: 1,
        views: 1,
        score: 1,
        createdAt: 1,
        author: {
          _id: '$authorDetails._id',
          name: '$authorDetails.name',
          email: '$authorDetails.email',
        },
      },
    },
  ]);

  return posts.map((post: any, index: number) => ({
    _id: post._id.toString(),
    rank: index + 1,
    title: post.title,
    author: post.author
      ? {
          _id: post.author._id ? post.author._id.toString() : '',
          name: post.author.name || 'Anonymous',
          email: post.author.email || '',
        }
      : { _id: '', name: 'Anonymous', email: '' },
    likes: post.likes || 0,
    views: post.views || 0,
    score: post.score || 0,
    createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
  }));
}

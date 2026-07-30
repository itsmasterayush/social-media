import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import mongoose from 'mongoose';

export async function getUserDashboard(userId: string) {
  await connectDB();

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [stats] = await Post.aggregate([
    { $match: { author: userObjectId } },
    {
      $group: {
        _id: null,
        totalPosts: { $sum: 1 },
        totalLikes: { $sum: '$likes' },
        totalViews: { $sum: '$views' },
      },
    },
  ]);

  const recentPosts = await Post.find({ author: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('author', 'name email')
    .lean();

  return {
    totalPosts: stats ? stats.totalPosts : 0,
    totalLikes: stats ? stats.totalLikes : 0,
    totalViews: stats ? stats.totalViews : 0,
    recentPosts: recentPosts.map((p: any) => ({
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
  };
}

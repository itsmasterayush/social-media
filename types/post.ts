import { IUser } from './auth';

export interface IPost {
  _id: string;
  title: string;
  content: string;
  author: IUser | string;
  likes: number;
  likedBy: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ILeaderboardPost {
  _id: string;
  rank: number;
  title: string;
  author: IUser | string;
  likes: number;
  views: number;
  score: number;
  createdAt: string;
}

export interface IDashboardStats {
  totalPosts: number;
  totalLikes: number;
  totalViews: number;
  recentPosts: IPost[];
}

export interface PaginatedPosts {
  posts: IPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

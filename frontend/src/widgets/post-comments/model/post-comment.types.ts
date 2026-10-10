import { Comment } from '@/entities/comment';
import { UserPreview } from '@/entities/user';

export type PostComment = Comment<UserPreview>;

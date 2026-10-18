import { authHandlers } from './auth.handlers';
import { postsHandlers } from './posts.handlers';

export const handlers = [...authHandlers, ...postsHandlers];

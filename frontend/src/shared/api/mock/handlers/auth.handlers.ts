import { http, HttpResponse } from 'msw';
import z from 'zod';

import { passwordSchema } from '../../../lib/schemas/password.schema';

interface UserLocation {
  country: string;
  city: string;
}

interface UserAchievement {
  id: string;
  name: string;
  imageUrl: string;
}

class MockUser {
  readonly id: string;
  avatarUrl?: string | null;
  profileBanerUrl?: string | null;
  readonly email: string;
  readonly password: string;
  readonly policy: boolean;
  readonly name: string;
  readonly userTag: string;
  readonly role: string;
  readonly verify?: boolean;
  description?: string;
  rank?: number;
  postsQuantity?: number;
  likes?: number;
  recivedLikes?: number;
  lastActivity?: string;
  webSite?: string;
  location?: UserLocation;
  achievements?: UserAchievement[];
  bookMarks?: number;
  birthday?: string;
  readonly updatedAt?: string;
  readonly createdAt: string;

  constructor(data: MockUser) {
    this.id = data.id;
    this.avatarUrl = data.avatarUrl ?? null;
    this.profileBanerUrl = data.profileBanerUrl ?? null;
    this.email = data.email;
    this.password = data.password;
    this.policy = data.policy;
    this.verify = data.verify ?? false;
    this.name = data.name;
    this.userTag = data.userTag;
    this.role = data.role;
    this.description = data.description ?? undefined;
    this.rank = data.rank ?? 0;
    this.postsQuantity = data.postsQuantity ?? 0;
    this.likes = data.likes ?? 0;
    this.recivedLikes = data.recivedLikes ?? 0;
    this.lastActivity = data.lastActivity ?? new Date().toISOString();
    this.webSite = data.webSite ?? undefined;
    this.location = data.location ?? undefined;
    this.achievements = data.achievements ?? [];
    this.bookMarks = data.bookMarks ?? 0;
    this.birthday = data.birthday ?? undefined;
    this.updatedAt = data.updatedAt ?? new Date().toISOString();
    this.createdAt = data.createdAt ?? new Date().toISOString();
  }
}

// -------------------------------- User Mock Data --------------------------------

const registerSchema = z.object({
  name: z.string().trim().min(3, 'Name must be at least 3 characters long'),
  email: z.email('Invalid email address'),
  password: passwordSchema,
  birthday: z.string().optional(),
  policy: z.boolean().refine((v) => v === true, 'You must agree to the policy'),
});

type UserRegisterRequest = z.infer<typeof registerSchema>;

// -------------------------------- Mock Storage --------------------------------
const STORAGE_KEYS = {
  users: 'msw_mock_users',
  refresh: 'msw_refresh_tokens',
  access: 'msw_access_tokens',
};

function loadMapFromStorage<K, V>(key: string): Map<K, V> {
  try {
    const saved = localStorage.getItem(key);
    return saved ? new Map(JSON.parse(saved)) : new Map();
  } catch (error) {
    console.log(error);
    return new Map();
  }
}

function saveMapToStorage<K, V>(key: string, map: Map<K, V>) {
  try {
    localStorage.setItem(key, JSON.stringify(Array.from(map.entries())));
  } catch (error) {
    console.error('Failed to save MSW state to localStorage', error);
  }
}

// ------------------------------- Token Management --------------------------------

const mockUsers = loadMapFromStorage<string, MockUser>(STORAGE_KEYS.users);
const refreshTokenToUserId = loadMapFromStorage<string, string>(
  STORAGE_KEYS.refresh,
);
const accessTokenToUserId = loadMapFromStorage<string, string>(
  STORAGE_KEYS.access,
);

let tokenCounter = 0;

function setAccessCookie(token: string) {
  document.cookie = `accessToken=${token}; path=/; SameSite=Lax; max-age=900`;
}

// Чтение accessToken из кук
function getAccessTokenFromCookie(cookieHeader: string): string | null {
  const match = cookieHeader.match(/accessToken=([^;]+)/);
  return match?.[1] ?? null;
}

function generateToken(prefix: string): string {
  tokenCounter += 1;
  return `${prefix}_${Date.now()}_${tokenCounter}`;
}

function setRefreshCookie(token: string) {
  document.cookie = `refreshToken=${token}; path=/; SameSite=Lax; max-age=604800`;
}

function clearAllCookies() {
  document.cookie = 'accessToken=; path=/; SameSite=Lax; max-age=0';
  document.cookie = 'refreshToken=; path=/; SameSite=Lax; max-age=0';
}

function getRefreshTokenFromCookie(cookieHeader: string): string | null {
  const match = cookieHeader.match(/refreshToken=([^;]+)/);
  return match?.[1] ?? null;
}

function createTokenPair(userId: string) {
  const accessToken = generateToken('access');
  const refreshToken = generateToken('refresh');

  accessTokenToUserId.set(accessToken, userId);
  refreshTokenToUserId.set(refreshToken, userId);

  saveMapToStorage(STORAGE_KEYS.access, accessTokenToUserId);
  saveMapToStorage(STORAGE_KEYS.refresh, refreshTokenToUserId);

  setAccessCookie(accessToken);
  setRefreshCookie(refreshToken);

  return {
    accessToken,
    refreshToken,
  };
}

function getUserByAccessToken(authHeader: string | null): MockUser | null {
  let token: string | null = null;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else {
    token = getAccessTokenFromCookie(document.cookie);
  }

  if (!token) return null;

  const userId = accessTokenToUserId.get(token);
  if (!userId) return null;

  return mockUsers.get(userId) ?? null;
}

const BASE = '/api';

const createAccessToken = () => {
  const id = crypto.randomUUID();
  const { accessToken } = createTokenPair(id);

  return {
    id,
    accessToken,
  };
};

export const authHandlers = [
  http.post<never, UserRegisterRequest>(`${BASE}/user`, async ({ request }) => {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return HttpResponse.json(
        { message: 'Validation failed', errors: result.error.format() },
        { status: 400 },
      );
    }

    const user = result.data;

    const existingUser = Array.from(mockUsers.values()).find(
      (u): u is MockUser => u.email === user.email || u.name === user.name,
    );

    if (existingUser) {
      return HttpResponse.json(
        { message: 'User already exists' },
        { status: 409 },
      );
    }

    const { accessToken, id } = createAccessToken();

    const newUser = new MockUser({
      ...user,
      id,
      role: 'Пользователь',
      userTag: `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    mockUsers.set(id, newUser);
    saveMapToStorage(STORAGE_KEYS.users, mockUsers);

    return HttpResponse.json({ accessToken, user: newUser }, { status: 200 });
  }),
  http.post<never, { login: string; password: string }>(
    `${BASE}/auth/login`,
    async ({ request }) => {
      const body = await request.json();
      const { login, password } = body;

      const user = Array.from(mockUsers.values()).find(
        (u): u is MockUser => u.email === login && u.password === password,
      );

      if (!user) {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const { accessToken } = createTokenPair(user.id);

      return HttpResponse.json({ accessToken, user }, { status: 200 });
    },
  ),
  http.post(`${BASE}/refresh`, () => {
    const cookieHeader = document.cookie;
    const refreshToken = getRefreshTokenFromCookie(cookieHeader);

    if (!refreshToken) {
      return HttpResponse.json(
        { message: 'No refresh token' },
        { status: 401 },
      );
    }

    const userId = refreshTokenToUserId.get(refreshToken);

    if (!userId) {
      return HttpResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 },
      );
    }

    refreshTokenToUserId.delete(refreshToken);

    const user = mockUsers.get(userId);
    if (!user) {
      return HttpResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 },
      );
    }

    const { accessToken } = createTokenPair(userId);

    return HttpResponse.json({
      accessToken,
      user,
    });
  }),
  http.post(`${BASE}/logout`, async ({ request }) => {
    const cookieHeader = document.cookie;
    const refreshToken = getRefreshTokenFromCookie(cookieHeader);

    if (refreshToken) {
      refreshTokenToUserId.delete(refreshToken);
    }

    const authHeader = request.headers.get('authorization');

    if (authHeader?.startsWith('Bearer ')) {
      accessTokenToUserId.delete(authHeader.slice(7));
    }

    saveMapToStorage(STORAGE_KEYS.access, accessTokenToUserId);
    saveMapToStorage(STORAGE_KEYS.refresh, refreshTokenToUserId);

    clearAllCookies();

    return HttpResponse.json({ message: 'Logged out' });
  }),
  http.get(`${BASE}/user/me`, async ({ request }) => {
    const authHeader = request.headers.get('authorization');
    const user = getUserByAccessToken(authHeader);

    console.log('User from /user/me:', user);

    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return HttpResponse.json({
      user,
    });
  }),
];

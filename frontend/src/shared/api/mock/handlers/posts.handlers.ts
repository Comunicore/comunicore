import { delay, http, HttpResponse } from 'msw';

import type {
  MessageAuthor,
  PostCommentItem,
  PostCreateCommentRequest,
  PostListItem,
  PostListResponse,
  PostWithCommentsListResponse,
} from '../../generated';
import { mockPostSummaries, MockPostSummary } from '../posts.data';

import { getUserByAccessToken } from './auth.handlers';

const BASE = '/api';

const mockAuthor = (id: number, displayName: string): MessageAuthor => ({
  id,
  username: displayName.toLowerCase().replace(/\s+/g, '-'),
  displayName,
  rank: 1,
});

const mockComments: PostCommentItem[] = [
  {
    id: 1,
    author: mockAuthor(2, 'BonkeyMonkey'),
    contentMd: 'Ну , я думаю лучше джава, джава скрипт сосёт 😝',
    createdAt: '2027-02-11T09:00:00Z',
  },
  {
    id: 2,
    author: mockAuthor(3, 'AntiMonkey'),
    contentMd:
      '[@BonkeyMonkey](#comment-1) Перечитай правила сайта! Выдаю предупреждение!!!',
    createdAt: '2027-02-11T10:00:00Z',
  },
  {
    id: 3,
    author: mockAuthor(2, 'BonkeyMonkey'),
    contentMd: '[@AntiMonkey](#comment-2) Обизьяна голой жопой не пугай расист',
    createdAt: '2027-02-11T11:00:00Z',
  },
  {
    id: 4,
    author: mockAuthor(4, 'Momoboy'),
    contentMd: '[@BonkeyMonkey](#comment-1) Твой банан у меня',
    createdAt: '2027-02-11T12:00:00Z',
  },
  {
    id: 5,
    author: mockAuthor(2, 'BonkeyMonkey'),
    contentMd: '[@Momoboy](#comment-4) А чапалахов тебе не завернуть?',
    createdAt: '2027-02-11T13:00:00Z',
  },
  {
    id: 6,
    author: mockAuthor(5, 'PonkeyDonkey'),
    contentMd:
      'ИнтересТный вАпрос на самам деле , наверное C# лучше джавы, поддерживается Windows и там ещё есть .NET который в себя включает кучу всего, начиная от мобильной разработки заканчивая веб разработкой и бэком, + игры можно делать на юнити, в общем швейцарский нож получается',
    createdAt: '2027-02-11T14:00:00Z',
  },
  {
    id: 7,
    author: mockAuthor(6, 'сосо Воронцов'),
    contentMd:
      'Сие прилюдное противостояние, развернувшееся на бескрайних просторах ИТ-вселенной года 2026-го, можно расценивать по-разному. Кто-то увидит здесь руку мудрого наставника, а кто-то — очередную попытку задушить неокрепший разум святыми догматами. Можно бесконечно разводить демагогию на форумах, до хрипоты спорить о сборщиках мусора и замерять наносекунды скорости, но истинность бытия это не решит — ведь в конце концов оба пути ведут к поиску пропущенной точки с запятой в три часа ночи.\nПосему, юный падаван, не трать свой ментальный ресурс на священные войны. Обходись любым синтаксисом, который больше импонирует твоему сердцу и обещает более сытное будущее. Выбирай то, к чему лежит душа: будь то древняя, как мир, многословная Java с её бесконечными фабриками фабрик, или элегантный, обласканный Microsoft си-шарп, на котором так приятно писать код, пока не закончатся бесплатные лицензии. К счастью, в этом дивном новом мире выбрать между двумя близнецами-братьями юному мужу стало гораздо легче — ведь оба они одинаково далеки от идеала, но одинаково хорошо кормят.',
    createdAt: '2027-02-11T15:00:00Z',
  },
];

const mockPost: Omit<PostWithCommentsListResponse, 'id' | 'uuid'> = {
  type: 'Обсуждение',
  category: 'Программирование',
  author: mockAuthor(1, 'CodeMaster'),
  title: 'Java или C# в 2026: Что выбрать новичку?',
  contentMd:
    'Всем привет! На дворе 2026 год, а я наконец-то решился кардинально изменить жизнь и войти в IT с полного нуля. Последний месяц я активно курю форумы, смотрю аналитику рынка, общаюсь со знакомыми разработчиками и, честно говоря, у меня уже голова идет кругом от обилия информации. В итоге я отбросил Python (потому что на джуниорские вакансии там сейчас дикий оверкволинг из-за нейросетей) и фронтенд (не лежит душа к верстке), и мой финальный выбор сузился до двух мощных тяжеловесов — Java и C#.\n\nМне очень нужен трезвый взгляд со стороны и совет бывалых, что из этого лучше выбрать новичку для старта прямо сейчас, в 2026-м.\n\nС одной стороны, меня дико манит C#. Из того, что я успел прочитать, экосистема .NET сейчас переживает свой лучший период: Microsoft выкатила ультрасовременные версии, язык стал невероятно быстрым, кроссплатформенным и, как говорят, писать на нем — одно удовольствие из-за чистого и лаконичного синтаксиса. К тому же я с детства поглядываю в сторону геймдева, а C# — это главный пропуск в Unity. Но меня пугает один момент: когда я открываю локальные сайты с вакансиями (смотрю по СНГ и удаленке), предложений для джунов на «шарпе» как будто ощутимо меньше, да и старый стереотип, что C# жестко привязан к Windows, кажется, всё еще сидит в головах у многих консервативных работодателей.\n\nС другой стороны, есть монументальная Java. Это, как я понимаю, абсолютная стабильность и вечный спрос. На ней написана вся банковская сфера, огромный Enterprise, финтех и куча госорганов. Да, язык ругают за некоторую громоздкость и консерватизм (хотя в последних версиях вроде Java 25 это активно исправляют), но объем legacy-кода в мире настолько огромен, что без работы Java-разработчик не останется в ближайшие лет двадцать точно. Плюс, если я перегорю к бэкенду, со знанием Java можно будет относительно легко мигрировать в мобильную разработку под Android на Kotlin. Однако тут свои подводные камни: огромная конкуренция среди таких же новичков, как я, и достаточно высокий, душный порог входа из-за фреймворка Spring, который требуют буквально на каждом собеседовании.\n\nРебята, помогите расставить приоритеты и сделать правильную ставку, чтобы не прогадать на старте. Что сейчас перспективнее для быстрого трудоустройства? Где экосистема дружелюбнее к новичку, который учится самостоятельно? Стоит ли гнаться за красотой C# и .NET или лучше пойти по консервативному, но надежному пути Java? Заранее всем спасибо за конструктивные ответы и личный опыт!',
  postStats: {
    commentsCount: mockComments.length,
    likesCount: 126,
    viewsCount: 2331,
  },
  createdAt: '2027-02-11T08:33:00Z',
  comments: mockComments,
};

const toListItem = ({
  id,
  title,
  category,
  createdAt,
}: MockPostSummary): PostListItem => ({
  id,
  uuid: `00000000-0000-4000-8000-${String(id).padStart(12, '0')}`,
  author: mockPost.author,
  category,
  title,
  type: mockPost.type,
  postStats: mockPost.postStats,
  createdAt,
});

const toNumericId = (value: string) =>
  [...value].reduce(
    (hash, char) => (hash * 31 + char.charCodeAt(0)) % 100000,
    7,
  );

export const postsHandlers = [
  http.get(`${BASE}/posts`, async ({ request }) => {
    await delay();

    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit')) || 20;
    const page = Number(url.searchParams.get('page')) || 1;
    const start = (page - 1) * limit;

    const response: PostListResponse = {
      posts: mockPostSummaries.slice(start, start + limit).map(toListItem),
      totalCountEstimated: mockPostSummaries.length,
      havePrev: page > 1,
      haveNext: start + limit < mockPostSummaries.length,
    };

    return HttpResponse.json(response);
  }),

  http.get(`${BASE}/posts/:postId`, async ({ params }) => {
    await delay();

    const postId = Number(params.postId);
    const summary = mockPostSummaries.find(({ id }) => id === postId);
    if (!summary) {
      return HttpResponse.json('post not found', { status: 404 });
    }

    const post: PostWithCommentsListResponse = {
      ...mockPost,
      ...toListItem(summary),
    };

    return HttpResponse.json(post);
  }),

  http.post<{ postId: string }, PostCreateCommentRequest>(
    `${BASE}/posts/:postId/comments`,
    async ({ request }) => {
      await delay(1500);

      const user = getUserByAccessToken(request.headers.get('authorization'));
      if (!user) {
        return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const { contentMd } = await request.json();
      if (!contentMd?.trim()) {
        return HttpResponse.json('empty comment', { status: 400 });
      }

      const comment: PostCommentItem = {
        id: mockComments.length + 1,
        author: {
          id: toNumericId(user.id),
          username: user.userTag,
          displayName: user.name,
          avatarUrl: user.avatarUrl ?? undefined,
          rank: user.rank ?? 0,
        },
        contentMd,
        createdAt: new Date().toISOString(),
      };

      mockComments.push(comment);
      mockPost.postStats.commentsCount = mockComments.length;

      return HttpResponse.json(comment, { status: 201 });
    },
  ),
];

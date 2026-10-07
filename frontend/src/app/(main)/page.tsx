import { BsArrowRight, BsChatFill, BsPeopleFill } from 'react-icons/bs';
import { FaShieldAlt } from 'react-icons/fa';
import {
  LuEye,
  LuGlobe,
  LuMessageSquare,
  LuMonitor,
  LuUsers,
} from 'react-icons/lu';
import { RiGraduationCapFill, RiLightbulbFill } from 'react-icons/ri';
import Image from 'next/image';
import Link from 'next/link';

import HeroSection from './HeroCards';

import ctaImage from '@/shared/assets/images/cta-bg.png';
import logoLetterImage from '@/shared/assets/images/logo-letter.png';
import { AppRouter } from '@/shared/config/app-router';
import { cn } from '@/shared/lib/classNames';
import { Button, Container, ProfileAvatar, ViewAllLink } from '@/shared/ui';

// ---------------------------------------------------------------------------
// Статичные данные (В будущем заменить на данные из БД)
// ---------------------------------------------------------------------------

const forumSections = [
  {
    id: 1,
    title: 'Общее обсуждение',
    description: 'Тут говорят обо всём на любые темы',
    topicsCount: '1.2к тем',
    messagesCount: '18.4к сообщений',
    Icon: BsChatFill,
    iconBg: 'bg-purple-67',
  },
  {
    id: 2,
    title: 'Идеи и предложения',
    description: 'Делись своими идеями и предлагай улучшения',
    topicsCount: '772 темы',
    messagesCount: '1.4к сообщений',
    Icon: RiLightbulbFill,
    iconBg: 'bg-blue-3e',
  },
  {
    id: 3,
    title: 'Технологии',
    description: 'Обсуди технологии, IT, софт и будущее',
    topicsCount: '1.7к тем',
    messagesCount: '12.4к сообщений',
    Icon: LuMonitor,
    iconBg: 'bg-green-39',
  },
  {
    id: 4,
    title: 'Развлечения',
    description: 'Фильмы, игры, музыка и всё, что радует',
    topicsCount: '2к темы',
    messagesCount: '11.2к сообщений',
    Icon: BsChatFill,
    iconBg: 'bg-purple-67',
  },
] as const;

const discussions = [
  {
    id: 1,
    title: 'Какой язык программирования учить в 2024 году',
    category: 'Технологии',
    categoryClass: 'bg-purple-67/20 text-pink-d5',
    author: 'CodeMaster',
    time: '4 мин. назад',
    comments: 24,
    views: '1.1k',
  },
  {
    id: 2,
    title: 'Лучшие фильмы 2024 года',
    category: 'Развлечения',
    categoryClass: 'bg-orange-ff/20 text-orange-ff',
    author: 'CodeMaster',
    time: '10 мин. назад',
    comments: 18,
    views: '980',
  },
  {
    id: 3,
    title: 'Как насчёт добавить несколько способов аутентификации?',
    category: 'Идеи и предложения',
    categoryClass: 'bg-blue-3e/20 text-blue-3e',
    author: 'CodeMaster',
    time: '10 мин. назад',
    comments: 11,
    views: '540',
  },
  {
    id: 4,
    title: 'В какое время года вы чаще гуляете?',
    category: 'Общие обсуждения',
    categoryClass: 'bg-green-39/20 text-green-00',
    author: 'CodeMaster',
    time: '10 мин. назад',
    comments: 9,
    views: '320',
  },
  {
    id: 5,
    title: 'Какой язык программирования учить в 2024 году',
    category: 'Технологии',
    categoryClass: 'bg-purple-67/20 text-pink-d5',
    author: 'CodeMaster',
    time: '10 мин. назад',
    comments: 30,
    views: '1.4k',
  },
] as const;

const forumStats = [
  { id: 1, label: 'Пользователи', value: '12 458', Icon: LuUsers },
  { id: 2, label: 'Тем', value: '4 732', Icon: BsChatFill },
  { id: 3, label: 'Сообщений', value: '58 214', Icon: LuMessageSquare },
  { id: 4, label: 'Онлайн', value: '312', Icon: LuEye },
] as const;

const activeUsers = [
  { id: 1, name: 'CodeMaster', score: '12 200' },
  { id: 2, name: 'DesignGuru', score: '1 221' },
  { id: 3, name: 'DevNinja', score: '1 200' },
  { id: 4, name: 'ByteWizard', score: '200' },
] as const;

const whyCards = [
  {
    id: 1,
    Icon: BsPeopleFill,
    title: 'Живое сообщество',
    description: 'Активные участники и дружелюбная атмосфера каждый день',
  },
  {
    id: 2,
    Icon: RiGraduationCapFill,
    title: 'Обмен знаниями',
    description:
      'Задавайте вопросы и получайте ответы от экспертов и участников',
  },
  {
    id: 3,
    Icon: FaShieldAlt,
    title: 'Поддержка идей',
    description: 'Твои идеи видны — предлагай и развивай проект вместе с нами',
  },
  {
    id: 4,
    Icon: LuGlobe,
    title: 'Без границ',
    description:
      'Общайся на любые темы и находи единомышленников по всему миру',
  },
] as const;

const communityStats = [
  { value: '12.4К', label: 'Пользователей' },
  { value: '4К', label: 'Тем' },
  { value: '223', label: 'Новых постов' },
  { value: '323', label: 'Онлайн сейчас' },
] as const;

const blogPosts = [
  {
    id: 1,
    categoryLabel: 'Обновление',
    categoryClass: 'bg-green-00/20 text-green-00',
    date: '2 дня назад',
    title: 'Новый дизайн и возможности Comunicore',
    description: 'Рассказываем о главных изменениях и новых функциях форума',
    imageUrl: '/blog-previews/1.jpg',
  },
  {
    id: 2,
    categoryLabel: 'Гайд',
    categoryClass: 'bg-blue-6e/20 text-blue-6e',
    date: '2 дня назад',
    title: 'Как получить максимум от участия в форуме',
    description: 'Полезные советы для новичков и активных участников',
    imageUrl: '/blog-previews/2.jpg',
  },
  {
    id: 3,
    categoryLabel: 'Технологии',
    categoryClass: 'bg-purple-67/20 text-pink-d5',
    date: '2 дня назад',
    title: 'Тренды по IT на 2026',
    description: 'Разбираем ключевые направления и технологии будущего',
    imageUrl: '/blog-previews/3.jpg',
  },
  {
    id: 4,
    categoryLabel: 'Развлечения',
    categoryClass: 'bg-orange-ff/20 text-orange-ff',
    date: '2 дня назад',
    title: 'Выбираем годный фильм вне зависимости от оценок',
    description: 'Как выбрать стоящий фильм',
    imageUrl: '/blog-previews/4.jpg',
  },
] as const;

export default function Home() {
  return (
    <Container>
      <section
        aria-labelledby='hero-heading'
        className='relative overflow-hidden'
      >
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-contain bg-center bg-no-repeat opacity-20 lg:hidden'
          style={{
            backgroundImage: `url(${logoLetterImage.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        />

        <div className='relative flex flex-col items-start justify-between gap-10 py-16 lg:flex-row lg:items-center lg:py-20'>
          <div className='flex max-w-137.5 flex-col gap-y-6'>
            <h1
              id='hero-heading'
              className='text-5xl leading-tight font-semibold lg:text-6xl'
            >
              Общайся.
              <br />
              Делись идеями.
              <br />
              Будь частью
              <br />
              <span className='text-purple-67'>Comunicore</span>
            </h1>

            <p className='text-gray-light leading-6'>
              Comunicore — это форум для тех, кто ценит живое общение, обмен
              знаниями и поддержку сообщества. Присоединяйся и стань частью
              чего-то большего.
            </p>

            <Button
              href={AppRouter.auth.registration}
              size='sm'
              className='group w-fit gap-x-3'
            >
              Присоедениться к сообществу
              <BsArrowRight size={20} aria-hidden='true' />
            </Button>
          </div>

          <HeroSection className='hidden lg:flex' />
        </div>
      </section>

      <section aria-labelledby='sections-heading'>
        <div className='flex flex-wrap items-center justify-between gap-5 pt-4 pb-8'>
          <h2 id='sections-heading' className='text-xl font-bold lg:text-2xl'>
            Популярные разделы
          </h2>
          <ViewAllLink
            href={AppRouter.questions}
            label='Смотреть все разделы'
          />
        </div>

        <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {forumSections.map(
            ({
              id,
              title,
              description,
              topicsCount,
              messagesCount,
              Icon,
              iconBg,
            }) => (
              <li key={id}>
                <Link
                  href={AppRouter.questions}
                  className='bg-dark-1b/50 hover:bg-dark-1b group flex h-full flex-col rounded-xl p-7.5 transition-colors'
                >
                  <div
                    className={cn(
                      'mb-4 flex size-10 items-center justify-center rounded-full',
                      iconBg,
                    )}
                  >
                    <Icon size={20} className='text-light' aria-hidden='true' />
                  </div>

                  <h3 className='mb-2 text-[18px] font-bold'>{title}</h3>
                  <p className='text-gray-9e mb-5 flex-1 text-[16px] leading-5'>
                    {description}
                  </p>

                  <div className='text-gray-9e flex gap-6 text-sm'>
                    <span>{topicsCount}</span>
                    <span>{messagesCount}</span>
                  </div>
                </Link>
              </li>
            ),
          )}
        </ul>
      </section>

      <section aria-labelledby='discussions-heading' className='mt-16'>
        <div className='flex flex-col gap-6 xl:flex-row xl:items-start'>
          {/* Список обсуждений */}
          <div className='min-w-0 flex-1'>
            <div className='mb-8 flex flex-wrap items-center justify-between gap-5'>
              <h2
                id='discussions-heading'
                className='text-xl font-bold lg:text-2xl'
              >
                Последние обсуждения
              </h2>
              <Link
                href={AppRouter.questions}
                className='text-purple-67 hover:text-purple-86 flex items-center gap-2 font-bold transition-colors'
              >
                Перейти на форум
                <BsArrowRight size={18} aria-hidden='true' />
              </Link>
            </div>

            <ul className='overflow-hidden rounded-xl'>
              {discussions.map(
                ({
                  id,
                  title,
                  category,
                  categoryClass,
                  author,
                  time,
                  comments,
                  views,
                }) => (
                  <li key={id}>
                    <Link
                      href={AppRouter.questions}
                      className='bg-dark-1b/50 hover:bg-dark-1b flex flex-col gap-y-4 border-b border-white/50 px-5 py-4 transition-colors last:border-b-0 lg:h-17.5 lg:flex-row lg:items-center lg:gap-x-4 lg:py-0'
                    >
                      {/* Бейдж категории */}
                      <span
                        className={cn(
                          'w-fit rounded-lg px-2.5 py-1 text-sm font-semibold lg:order-2',
                          categoryClass,
                        )}
                      >
                        {category}
                      </span>

                      {/* Заголовок поста */}
                      <p className='min-w-0 flex-1 text-[20px] font-medium lg:order-1 lg:truncate'>
                        {title}
                      </p>

                      <div className='flex flex-wrap items-center gap-x-5 gap-y-2 lg:contents'>
                        <div className='flex items-center gap-2 lg:order-3'>
                          {/* TODO: аватар автора из API */}
                          <ProfileAvatar
                            authorName={author}
                            width={24}
                            height={24}
                            className='size-6'
                          />
                          <span className='text-gray-9e text-sm'>{author}</span>
                        </div>

                        <span className='text-gray-9e text-sm lg:order-3 lg:w-28 lg:text-right'>
                          {time}
                        </span>

                        {/* Счётчики */}
                        <div className='flex items-center gap-4 lg:order-3'>
                          <span className='text-gray-9e flex items-center gap-1.5 text-sm'>
                            <LuMessageSquare size={16} aria-hidden='true' />
                            {comments}
                          </span>
                          <span className='text-gray-9e flex items-center gap-1.5 text-sm'>
                            <LuEye size={16} aria-hidden='true' />
                            {views}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Боковая панель */}
          <aside
            className='w-full shrink-0 xl:w-101.25'
            aria-label='Статистика форума'
          >
            {/* Статистика форума */}
            <div className='bg-dark-1b/60 rounded-t-xl p-5'>
              <h3 className='mb-5 text-[18px] font-bold'>Статистика форума</h3>
              <ul className='flex flex-col gap-5'>
                {forumStats.map(({ id, label, value, Icon }) => (
                  <li key={id} className='flex items-center justify-between'>
                    <div className='text-gray-9e flex items-center gap-3'>
                      <Icon size={14} aria-hidden='true' />
                      <span className='text-[16px]'>{label}</span>
                    </div>
                    <span className='text-[16px] font-semibold'>{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Новые пользователи */}
            <div className='bg-dark-1b/60 border-gray-9e/40 border-t p-5'>
              <h3 className='mb-5 text-[18px] font-bold'>Новые пользователи</h3>
              {/* TODO: аватар нового пользователя из API */}
              <div className='flex gap-2.5'>
                {Array.from({ length: 5 }).map((_, index) => (
                  <ProfileAvatar
                    key={index}
                    authorName={`user-${index}`}
                    width={30}
                    height={30}
                  />
                ))}
              </div>
            </div>

            {/* Активные пользователи */}
            <div className='bg-dark-1b/60 border-gray-9e/40 rounded-b-xl border-t p-5'>
              <h3 className='mb-5 text-[18px] font-bold'>
                Активные пользователи
              </h3>
              <ul className='flex flex-col gap-5'>
                {activeUsers.map(({ id, name, score }) => (
                  <li key={id} className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      {/* TODO: аватар активного пользователя из API */}
                      <ProfileAvatar
                        authorName={name}
                        width={30}
                        height={30}
                        className='size-7.5'
                      />
                      <span className='text-[16px]'>{name}</span>
                    </div>
                    <span className='text-[16px]'>{score}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='mt-5'>
              <Link
                href={AppRouter.questions}
                className='text-purple-67 hover:text-purple-86 flex items-center gap-2 font-bold transition-colors'
              >
                Смотреть всех
                <BsArrowRight size={18} aria-hidden='true' />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby='why-heading' className='mt-16'>
        <h2 id='why-heading' className='mb-10 text-xl font-bold lg:text-2xl'>
          Почему выбирают нас?
        </h2>
        <ul className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {whyCards.map(({ id, Icon, title, description }) => (
            <li
              key={id}
              className='bg-dark-1b/50 flex flex-col items-center gap-y-5 rounded-xl px-5 py-12.5 text-center'
            >
              <Icon size={40} className='text-purple-67' aria-hidden='true' />
              <div className='flex flex-col gap-y-1'>
                <h3 className='text-[18px] font-bold'>{title}</h3>
                <p className='text-gray-9e text-[16px] leading-5'>
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        aria-labelledby='stats-heading'
        className='bg-gradient-purple-2 mt-16 flex flex-col gap-y-12 rounded-2xl p-15'
      >
        <h2
          id='stats-heading'
          className='text-center text-[20px] font-bold lg:text-4xl'
        >
          Наше сообщество в цифрах
        </h2>
        <ul className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {communityStats.map(({ value, label }) => (
            <li key={label} className='flex flex-col items-center gap-3'>
              <span className='text-purple-86 text-4xl font-bold lg:text-5xl'>
                {value}
              </span>
              <span className='text-center text-lg lg:text-2xl'>{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby='blog-heading' className='mt-16'>
        <h2 id='blog-heading' className='mb-10 text-xl font-bold lg:text-2xl'>
          Свежие публикации в блоге
        </h2>
        <ul className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
          {blogPosts.map(
            ({
              id,
              categoryLabel,
              categoryClass,
              date,
              title,
              description,
              imageUrl,
            }) => (
              <li key={id}>
                <Link
                  href={AppRouter.main}
                  className='bg-dark-1b hover:bg-dark-1b/80 group flex h-full flex-col overflow-hidden rounded-[20px] transition hover:scale-105'
                >
                  <div className='bg-dark-1b/50 text-gray-9e relative h-37.5 sm:h-50'>
                    <Image
                      src={imageUrl}
                      alt='preview'
                      fill
                      className='object-cover'
                    />
                  </div>

                  <div className='flex flex-1 flex-col p-5'>
                    <div className='mb-4 flex items-center justify-between gap-2'>
                      <span
                        className={cn(
                          'rounded-md px-2.5 py-1 text-sm font-semibold',
                          categoryClass,
                        )}
                      >
                        {categoryLabel}
                      </span>
                      <span className='text-gray-9e text-sm'>{date}</span>
                    </div>
                    <h3 className='group-hover:text-purple-86 mb-2 text-[18px] leading-snug font-bold transition-colors'>
                      {title}
                    </h3>
                    <p className='text-gray-9e mt-auto text-[16px] leading-5'>
                      {description}
                    </p>
                  </div>
                </Link>
              </li>
            ),
          )}
        </ul>
      </section>

      <section aria-labelledby='cta-heading' className='mt-16'>
        <div
          className='bg-gradient-purple-2 relative overflow-hidden rounded-t-2xl px-10 py-15'
          style={{
            backgroundImage: `url(${ctaImage.src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'right',
          }}
        >
          <div className='max-w-lg'>
            <h2
              id='cta-heading'
              className='mb-2 text-3xl leading-tight font-bold lg:text-4xl'
            >
              Готов стать частью <br />
              <span className='text-purple-86'>Comunicore?</span>
            </h2>
            <p className='text-light mb-10 text-base'>
              Присоединяйся к нашему сообществу и начни общаться уже сегодня!
            </p>
            <Button
              href={AppRouter.auth.registration}
              size='md'
              className='gap-x-3'
            >
              Присоедениться
              <BsArrowRight size={20} aria-hidden='true' />
            </Button>
          </div>
        </div>
      </section>
    </Container>
  );
}

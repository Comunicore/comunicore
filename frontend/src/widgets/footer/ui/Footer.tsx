import {
  FaGithub,
  FaInstagram,
  FaTelegramPlane,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

import logo from '@/shared/assets/images/logo.svg';
import { AppRouter } from '@/shared/config/app-router';
import { Button, Container, Input, Label } from '@/shared/ui';

const navigationLinks = [
  { label: 'Форум', href: AppRouter.threads.root },
  { label: 'Участники', href: AppRouter.main },
  { label: 'Блог', href: AppRouter.main },
  { label: 'Правила', href: AppRouter.rules.root },
];

const supportLinks = [
  { label: 'Помощь', href: AppRouter.support },
  { label: 'Правила форума', href: AppRouter.rules.root },
  { label: 'Обратная связь', href: AppRouter.support },
  { label: 'Баг-трекер', href: AppRouter.support },
];

const legalLinks = [
  { label: 'Политика конфиденциальности', href: AppRouter.main },
  { label: 'Условия использования', href: AppRouter.main },
];

const socialLinks = [
  { label: 'Telegram', href: '#', icon: FaTelegramPlane },
  { label: 'YouTube', href: '#', icon: FaYoutube },
  { label: 'Instagram', href: '#', icon: FaInstagram },
  { label: 'Twitter', href: '#', icon: FaTwitter },
  { label: 'GitHub', href: '#', icon: FaGithub },
];

export function Footer() {
  return (
    <footer className='bg-dark-0e relative after:absolute after:top-0 after:right-0 after:left-0 after:h-px after:bg-[linear-gradient(90deg,transparent,color-mix(in_srgb,var(--color-light)_15%,transparent),transparent)] after:content-[""]'>
      <Container>
        <div className='grid grid-cols-1 justify-between gap-10 py-8 sm:grid-cols-2 lg:py-12.5 xl:grid-cols-[auto_auto_auto_auto]'>
          <section>
            <Link href={AppRouter.main} className='inline-flex'>
              <Image
                src={logo}
                alt='Comunicore'
                width={180}
                height={33}
                className='w-34 lg:w-42'
              />
            </Link>

            <p className='text-gray-9e mt-4 max-w-64 text-[16px] leading-5'>
              Место, где идеи становятся реальностью, а люди - друзьями
            </p>

            <ul className='mt-5 flex items-center gap-5'>
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    className='hover:text-purple-86 focus-visible:outline-purple-86 text-light block transition-colors focus-visible:outline-2 focus-visible:outline-offset-4'
                  >
                    <Icon size={24} aria-hidden='true' />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <nav aria-label='Навигация' className='flex flex-col gap-y-3.75'>
            <h2 className='text-[18px] font-bold'>Навигация</h2>
            <ul className='text-gray-9e flex flex-col gap-y-1.25 text-[16px] leading-5'>
              {navigationLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className='hover:text-purple-86'>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label='Поддержка' className='flex flex-col gap-y-3.75'>
            <h2 className='text-[18px] font-bold'>Поддержка</h2>
            <ul className='text-gray-9e flex flex-col gap-y-1.25 text-[16px] leading-5'>
              {supportLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className='hover:text-purple-86'>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section aria-labelledby='footer-subscribe'>
            <h2 id='footer-subscribe' className='text-[18px] font-bold'>
              Подпишитесь на новости
            </h2>
            <p className='text-gray-9e mt-3 max-w-80 text-[16px] leading-5'>
              Получай уведомления о вакансиях, обновлениях и событиях форума.
            </p>

            <form className='mt-7.5 flex flex-col gap-3 md:flex-row'>
              <Label htmlFor='footer-email' className='sr-only'>
                Email
              </Label>
              <Input
                id='footer-email'
                type='email'
                name='email'
                placeholder='Введите Email'
              />
              <Button
                type='submit'
                className='w-full rounded-[10px] px-2 md:w-auto'
              >
                Подписаться
              </Button>
            </form>
          </section>
        </div>

        <div className='text-gray-9e flex flex-col gap-6 py-5 text-[16px] lg:flex-row lg:items-center lg:justify-between'>
          <p>© 2024 Comunicore. Все права защищены.</p>

          <ul className='flex flex-col gap-3 sm:flex-row sm:gap-10'>
            {legalLinks.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className='hover:text-purple-86'>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { LuArrowRight } from 'react-icons/lu';
import Link from 'next/link';

import { EditorFormTracker } from '@/widgets/editor-form-tracker';

import { AppRouter } from '@/shared/config/app-router';
import { communityRules } from '@/shared/config/community-rules';
import { Tile } from '@/shared/ui';

interface HintsProps {
  editorModeParam: string;
  previewMode: string;
}

export default function Hints({ editorModeParam, previewMode }: HintsProps) {
  const [rules, setRules] = useState(() => communityRules.slice(0, 3));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRules(communityRules.slice(0, 3));
      } else {
        setRules([...communityRules]);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className='flex flex-col gap-y-10 **:[h2]:text-lg **:[h2]:font-bold'>
      <EditorFormTracker
        className='max-md:hidden'
        editorModeParam={editorModeParam}
        previewMode={previewMode}
      />

      <Tile className='flex flex-col gap-y-5' color='bordered'>
        <h2>Правила сообщества</h2>

        <p className='text-gray-9e'>
          Пожалуйста, перед публикацией ознакомьтесь с нашими{' '}
          <Link href={AppRouter.rules.community} className='text-pink-d5'>
            правилами
          </Link>
        </p>

        <ul className='flex list-disc flex-col gap-y-3 pl-5'>
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>

        <Link
          href={AppRouter.rules.root}
          className='text-pink-d5 flex items-center justify-center gap-x-5 text-lg'
        >
          Читать правила полностью{' '}
          <span>
            <LuArrowRight size={16} />
          </span>
        </Link>
      </Tile>
    </div>
  );
}

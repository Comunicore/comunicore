import { LuArrowRight } from 'react-icons/lu';
import Link from 'next/link';

import { EditorFormTracker } from '@/widgets/editor-form-tracker';

import { AppRouter } from '@/shared/config/app-router';
import { Tile } from '@/shared/ui';

const communityRulesMap = [
  'Будьте вежливы и уважительны',
  'Запрещён спам, флуд и любая несанкционированная реклама',
  'Не публикуйте личные данные (как свои так и чужие)',
  'Офтоп. Запрещено уводить обсуждение в сторону от темы, заданной автором топика. Для отвлеченных разговоров есть соответствующий раздел',
  'Строго запрещено обсуждение политики, религии и межнациональных розней',
  'Запрещена намеренная дезинформация, клевета, фейки и провокации (троллинг)',
  'Используйте поиск перед публикацией, чтобы избежать повтора тем',
  'Оформляйте код, логи и большие изображения в специальные теги/спойлеры',
] as const;

interface HintsProps {
  editorModeParam: string;
  previewMode: string;
}

export default function Hints({ editorModeParam, previewMode }: HintsProps) {
  return (
    <div className='flex flex-col gap-y-10 **:[h2]:text-lg **:[h2]:font-bold'>
      <EditorFormTracker
        editorModeParam={editorModeParam}
        previewMode={previewMode}
      />

      {/* rules */}
      <Tile className='flex flex-col gap-y-5'>
        <h2>Правила сообщества</h2>

        <p className='text-gray-9e'>
          Пожалуйста, перед публикацией ознакомьтесь с нашими{' '}
          <Link href={AppRouter.rules.community} className='text-pink-d5'>
            правилами
          </Link>
        </p>

        <ul className='flex list-disc flex-col gap-y-3 pl-5'>
          {communityRulesMap.map((rule) => (
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

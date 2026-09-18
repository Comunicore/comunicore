import { Dispatch, SetStateAction } from 'react';
import clsx from 'clsx';

import { EditorMode } from '../model/mode.types';

const modes: EditorMode[] = ['edit', 'preview'];

const buttonStyles: Record<EditorMode, string> = {
  edit: 'bg-white text-neutral-900 rounded-md',
  preview: 'bg-white text-neutral-900 rounded-md',
};

export function ModeSwitcher({
  setMode,
  mode,
}: {
  setMode: Dispatch<SetStateAction<EditorMode>>;
  mode: EditorMode;
}) {
  return (
    <div
      className='grid size-full max-w-50 grid-cols-2 text-white'
      role='tablist'
    >
      {modes.map((item) => (
        <button
          key={item}
          type='button'
          role='tab'
          aria-selected={mode === item}
          onClick={() => setMode(item)}
          className={clsx(
            'w-full px-3 py-2 duration-200',
            mode === item && buttonStyles[item],
          )}
        >
          {item === 'edit' ? 'Edit' : 'Preview'}
        </button>
      ))}
    </div>
  );
}

import { type HTMLAttributes, PropsWithChildren, useMemo } from 'react';

import { cn } from '../lib/classNames';

type TagColor =
  'purple' | 'orange' | 'blue' | 'green' | 'dark-purple' | 'cyan' | 'dark';

type TagSize = 'sm' | 'md' | 'lg' | 'xl';

export interface TagProps
  extends HTMLAttributes<HTMLSpanElement>, PropsWithChildren {
  color?: TagColor;
  size?: TagSize;
}

const colorStyles: Record<TagColor, string> = {
  green: 'border bg-green-39/20 border-gray-9e/10 text-green-00',
  purple: 'border bg-purple-67/20 border-gray-9e/10 text-pink-d5',
  'dark-purple': 'border bg-purple-86/20 border-gray-9e/10 text-purple-86',
  cyan: 'border bg-green-39/20 border-gray-9e/10 text-green-81',
  blue: 'border bg-blue-3e/20 border-gray-9e/10 text-blue-92',
  orange: 'border bg-orange-ff/20 border-gray-9e/10 text-orange-ff',
  dark: 'text-gray-9e bg-dark-1b/50 border border-gray-9e/10 font-normal',
};

const bannedColors: TagColor[] = ['dark'];

const ALL_COLORS = (Object.keys(colorStyles) as TagColor[]).filter(
  (color) => !bannedColors.includes(color),
);

const sizeStyles: Record<TagSize, string> = {
  sm: 'px-[20px] py-[10px] text-[14px]' /* mozno meniat */,
  md: 'px-1.5 h-7.5 text-sm',
  lg: 'px-4 h-7.5 text-sm',
  xl: 'px-[50px] py-[20px] text-[18px]' /* mozno meniat */,
};

const getColorByText = (text: string): TagColor => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ALL_COLORS.length;
  return ALL_COLORS[index];
};

export function Tag(props: TagProps) {
  const { children, className, color, size = 'md', ...restProps } = props;

  const textContent = typeof children === 'string' ? children : '';

  const finalColor = useMemo(() => {
    if (color) return color;
    return textContent ? getColorByText(textContent) : 'purple';
  }, [color, textContent]);

  const commonClassName = cn(
    'inline-flex items-center justify-center w-fit',
    'rounded-[5px] text-center font-semibold',
    colorStyles[finalColor],
    sizeStyles[size],
    className,
  );
  return (
    <span className={commonClassName} {...restProps}>
      {children}
    </span>
  );
}

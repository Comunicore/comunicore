import { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '../lib/classNames';

type TileSize = 'sm' | 'md' | 'lg' | 'xl';
type TIleColor = 'gray' | 'ghost';

interface TileProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
  color?: TIleColor;
  size?: TileSize;
}

const sizeStyles: Record<TileSize, string> = {
  sm: 'p-3.75 rounded-[1.25rem]',
  md: 'p-5 rounded-[1.25rem]',
  lg: 'px-5 py-7.5 rounded-[1.25rem]',
  xl: 'p-7.5 rounded-[1.25rem]',
};

const colorStyles: Record<TIleColor, string> = {
  gray: 'bg-dark-1b border border-gray-9e/10',
  ghost: 'bg-dark-1b/50',
};

export function Tile(props: TileProps) {
  const {
    children,
    color = 'gray',
    size = 'md',
    className = '',
    ...restAttrs
  } = props;

  const commonClassName = cn(colorStyles[color], sizeStyles[size], className);

  return (
    <div className={commonClassName} {...restAttrs}>
      {children}
    </div>
  );
}

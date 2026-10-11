import { HTMLAttributes, PropsWithChildren } from 'react';

import { cn } from '../lib/classNames';

// Варианты плиток из макета. Стили плитки задаются только через props,
// в className передаётся раскладка содержимого (flex, gap и т.п.)

type TileColor = 'gray' | 'solid' | 'ghost' | 'bordered';
type TileRadius = 'md' | 'lg';
type TileSize = 'xs' | 'sm' | 'compact' | 'md' | 'lg' | 'xl';

interface TileProps
  extends PropsWithChildren, Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  color?: TileColor;
  radius?: TileRadius;
  size?: TileSize;
}

const colorStyles: Record<TileColor, string> = {
  gray: 'bg-dark-1b border border-gray-9e/10',
  solid: 'bg-dark-1b',
  ghost: 'bg-dark-1b/50',
  bordered: 'bg-dark-1b/50 border border-gray-9e/10',
};

const radiusStyles: Record<TileRadius, string> = {
  md: 'rounded-[0.625rem]',
  lg: 'rounded-[1.25rem]',
};

const sizeStyles: Record<TileSize, string> = {
  xs: 'p-2.5',
  sm: 'p-3.75',
  compact: 'px-3.75 py-5',
  md: 'p-5',
  lg: 'px-5 py-7.5',
  xl: 'p-5 md:p-7.5',
};

export function Tile(props: TileProps) {
  const {
    children,
    color = 'gray',
    radius = 'lg',
    size = 'md',
    className = '',
    ...restAttrs
  } = props;

  const commonClassName = cn(
    colorStyles[color],
    radiusStyles[radius],
    sizeStyles[size],
    className,
  );

  return (
    <div className={commonClassName} {...restAttrs}>
      {children}
    </div>
  );
}

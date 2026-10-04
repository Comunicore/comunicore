import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
  Ref,
} from 'react';
import Link from 'next/link';

import { cn } from '../lib/classNames';

type HoverStyle = 'purple' | 'pink' | 'bordered' | 'transparent' | 'ghost';
type ButtonSize = 'min-sm' | 'sm' | 'md' | 'max-lg' | 'lg' | 'xl' | 'square';
type ButtonColor = 'purple' | 'ghost' | 'bordered' | 'transparent' | 'red';

type ButtonProps = Partial<
  AnchorHTMLAttributes<HTMLAnchorElement> &
    ButtonHTMLAttributes<HTMLButtonElement>
> & {
  children: ReactNode;
  href?: string;
  className?: string;
  color?: ButtonColor;
  size?: ButtonSize;
  hoverStyle?: HoverStyle;
};

const colorStyles: Record<ButtonColor, string> = {
  purple:
    'bg-purple-67 border border-purple-67 hover:bg-transparent hover:text-purple-67',
  ghost: 'bg-transparent border border-gray-9e/10 hover:border-gray-9e',
  red: 'bg-[#FF3939]/30 text-[#FF3939] border border-gray-9e/10 hover:border-gray-9e',
  bordered:
    'bg-dark-1b border border-gray-9e/10 hover:bg-transparent hover:border-gray-9e/30 disabled:opacity-30 disabled:pointer-events-none',
  transparent:
    'bg-transparent border border-gray-9e/10 hover:bg-dark-1b hover:border-gray-9e/30',
};

const hoverStyles: Record<HoverStyle, string> = {
  purple: 'hover:bg-transparent hover:text-purple-67',
  pink: 'hover:bg-pink-86 duration-200 hover:text-white hover:border-pink-86',
  ghost: 'hover:border-gray-9e',
  bordered: 'hover:bg-transparent hover:border-gray-9e/30',
  transparent: 'hover:bg-dark-1b hover:border-gray-9e/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  square: 'size-10 text-2xl font-normal',
  'min-sm':
    'px-[6px] py-[8px] text-sm md:px-[10px] md:py-[12px] md:text-[18px] font-light',
  sm: 'px-[20px] py-[10px] text-[14px]',
  md: 'px-[20px] py-[14px] text-[16px]',
  lg: 'px-[15px] py-[15px] text-[18px]',
  'max-lg': 'px-[53px] py-[20px] text-[18px] rounded-[5px]',
  xl: 'w-full p-[20px] text-[18px] rounded-[10px]',
};

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    children,
    href,
    className,
    color = 'purple',
    size = 'md',
    hoverStyle = 'transparent',
    ...restProps
  } = props;

  const commonClassName = cn(
    'inline-flex items-center justify-center w-fit cursor-pointer',
    'rounded-[5px] duration-200 text-center font-bold text-white',
    colorStyles[color],
    sizeStyles[size],
    hoverStyles[hoverStyle],
    className,
  );

  if (href) {
    return (
      <Link
        href={href}
        ref={ref as Ref<HTMLAnchorElement>}
        className={commonClassName}
        {...(restProps satisfies AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type='button'
      ref={ref as Ref<HTMLButtonElement>}
      className={commonClassName}
      {...(restProps satisfies ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

import { forwardRef, InputHTMLAttributes } from 'react';
import { LuCheck } from 'react-icons/lu';

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  size?: number;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, size = 16, ...rest }, ref) => (
    <div
      className='relative flex items-center justify-center'
      style={{ width: size, height: size }}
    >
      <input
        className='peer border-gray-9e checked:border-purple-67 focus-visible:outline-purple-86 cursor-pointer appearance-none rounded-sm border-2 duration-200 focus-visible:outline-2 focus-visible:outline-offset-2'
        id={id}
        type='checkbox'
        ref={ref}
        style={{ width: size, height: size }}
        {...rest}
      />
      <div className='pointer-events-none absolute hidden peer-checked:block'>
        <LuCheck aria-hidden={true} size={size} className='text-purple-67' />
      </div>
    </div>
  ),
);

Checkbox.displayName = 'Checkbox';

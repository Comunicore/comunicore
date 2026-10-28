import { cn } from '../lib/classNames';

type Tone = 'error' | 'empty' | 'info';

const TONES: Record<Tone, { circle: string; icon: string }> = {
  error: { circle: 'bg-red-500/10 ring-red-500/20', icon: 'text-red-400' },
  empty: { circle: 'bg-white/5 ring-white/10', icon: 'text-gray-400' },
  info: {
    circle: 'bg-purple-500/10 ring-purple-500/20',
    icon: 'text-purple-400',
  },
};

interface StatePlaceholderProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  tone?: Tone;
  actions?: React.ReactNode;
  className?: string;
}
export function StatePlaceholder({
  icon,
  title,
  description,
  tone = 'empty',
  actions,
  className,
}: StatePlaceholderProps) {
  const tones = TONES[tone];
  return (
    <div
      className={cn(
        'border-gray-9e/20 bg-dark-1b/30 flex flex-col items-center justify-center gap-y-5 rounded-2xl border border-dashed px-6 py-12 text-center',
        className,
      )}
    >
      <div
        className={cn(
          'grid size-16 place-items-center rounded-full ring-8',
          tones.circle,
          tones.icon,
        )}
      >
        {icon}
      </div>

      <div className='grid max-w-sm gap-y-2'>
        <h3 className='text-lg font-bold'>{title}</h3>
        {description && <p className='text-sm text-gray-500'>{description}</p>}
      </div>

      {actions && (
        <div className='flex flex-wrap justify-center gap-3'>{actions}</div>
      )}
    </div>
  );
}

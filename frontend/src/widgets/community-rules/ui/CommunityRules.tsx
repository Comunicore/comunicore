import { AppRouter } from '@/shared/config/app-router';
import { communityRules } from '@/shared/config/community-rules';
import { cn } from '@/shared/lib/classNames';
import { Tile, ViewAllLink } from '@/shared/ui';

interface CommunityRulesProps {
  className?: string;
}

export function CommunityRules({ className }: CommunityRulesProps) {
  return (
    <Tile
      radius='md'
      size='compact'
      className={cn('flex flex-col gap-y-3.75', className)}
    >
      <h2 className='text-lg leading-normal font-bold'>Правила сообщества</h2>
      <ul className='text-light/95 flex flex-col gap-y-3 font-(family-name:--font-inter) text-lg leading-5 tracking-[0.01em]'>
        {communityRules.map((rule) => (
          <li key={rule} className='flex items-baseline gap-x-1'>
            <span className='w-2.25 shrink-0 text-base' aria-hidden='true'>
              •
            </span>
            {rule}
          </li>
        ))}
      </ul>
      <ViewAllLink
        href={AppRouter.rules.community}
        label='Читать правила полностью'
        className='w-fit gap-2.5 text-lg leading-6.25'
      />
    </Tile>
  );
}

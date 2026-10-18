import { AppRouter } from '@/shared/config/app-router';
import { communityRules } from '@/shared/config/community-rules';
import { cn } from '@/shared/lib/classNames';
import { Tile, ViewAllLink } from '@/shared/ui';

const MOBILE_RULES_LIMIT = 4;

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
      <h2 className='text-[20px] leading-normal font-bold'>
        Правила сообщества
      </h2>
      <ul className='text-light/95 flex flex-col gap-y-3 font-(family-name:--font-inter) text-base leading-5 tracking-[0.01em]'>
        {communityRules.map((rule, index) => (
          <li
            key={rule}
            className={cn(
              'flex items-baseline gap-x-1',
              index >= MOBILE_RULES_LIMIT && 'max-md:hidden',
            )}
          >
            <span className='w-2.25 shrink-0' aria-hidden='true'>
              •
            </span>
            {rule}
          </li>
        ))}
      </ul>
      <ViewAllLink
        href={AppRouter.rules.community}
        label='Читать правила полностью'
        className='gap-2.5 self-center text-lg leading-6.25'
      />
    </Tile>
  );
}

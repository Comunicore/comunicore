import Header from './_ui/Header';
import Hints from './_ui/Hints';

import { CreateThreadPanel } from '@/features/create-thread-panel';

import { Container } from '@/shared/ui';

export default function NewThreadPage() {
  return (
    <Container>
      <section className='grid grid-cols-[1fr_23.125rem] gap-x-12.5 gap-y-10 pt-21 pb-10'>
        <Header className='col-span-2' />
        <CreateThreadPanel />
        <Hints />
      </section>
    </Container>
  );
}

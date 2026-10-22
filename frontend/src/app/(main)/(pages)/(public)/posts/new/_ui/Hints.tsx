import { CommunityRules } from '@/widgets/community-rules';
import { EditorFormTracker } from '@/widgets/editor-form-tracker';

interface HintsProps {
  editorModeParam: string;
  previewMode: string;
}

export default function Hints({ editorModeParam, previewMode }: HintsProps) {
  return (
    <div className='flex flex-col gap-y-10 **:[h2]:text-lg **:[h2]:font-bold'>
      <EditorFormTracker
        className='max-md:hidden'
        editorModeParam={editorModeParam}
        previewMode={previewMode}
      />

      <CommunityRules />
    </div>
  );
}

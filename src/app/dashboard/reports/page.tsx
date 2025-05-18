import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';

export const metadata = {
  title: 'Dashboard : Reports'
};

export default function page() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <Heading
          title='현재 보고서 페이지에 있습니다 👋'
          description='이곳은 대시보드 보고서 콘텐츠 페이지입니다'
        />
      </div>
    </PageContainer>
  );
}

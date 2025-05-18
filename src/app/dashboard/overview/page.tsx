import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';

export const metadata = {
  title: 'Dashboard : Overview'
};

export default function page() {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-2'>
        <Heading
          title='안녕하세요, 다시 오신 것을 환영합니다 👋'
          description='이곳은 대시보드 개요 콘텐츠 페이지입니다'
        />
      </div>
    </PageContainer>
  );
}

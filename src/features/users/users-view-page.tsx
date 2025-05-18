import { fakeUsers, User } from '@/constants/mock-api';
import { notFound } from 'next/navigation';
import UserForm from './users-form';

type TUserViewPageProps = {
  userId: string;
};

export default async function UserViewPage({ userId }: TUserViewPageProps) {
  let user: User | null = null;
  let pageTitle = '새 사용자 만들기';

  if (userId !== 'new') {
    const data = await fakeUsers.getUserById(Number(userId));
    if (!data.success || !data.user) {
      notFound();
    }

    user = data.user;
    pageTitle = 'Edit User';
  }

  return <UserForm initialData={user} pageTitle={pageTitle} />;
}

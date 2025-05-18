import { NavItem } from '@/types';

export interface MockAuthUser {
  imageUrl?: string;
  fullName?: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
}

export const mockAuthUser: MockAuthUser = {
  imageUrl: 'https://i.pravatar.cc/150?u=azamatrasulov',
  fullName: '아자맛 라술로프',
  emailAddresses: [{ emailAddress: 'azamat.rasulov@example.com' }]
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: '대시보드',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: '사용자 관리',
    url: '#',
    icon: 'user',
    isActive: true,

    items: [
      {
        title: '사용자',
        url: '/dashboard/users'
      },
      {
        title: '분석',
        url: '/dashboard/analytics'
      },
      {
        title: '보고서',
        url: '/dashboard/reports'
      }
    ]
  }
];

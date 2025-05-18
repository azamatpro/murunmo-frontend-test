'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: '대시보드', link: '/dashboard' }],
  '/dashboard/employee': [
    { title: '대시보드', link: '/dashboard' },
    { title: '직원 관리', link: '/dashboard/employee' }
  ],
  '/dashboard/product': [
    { title: '대시보드', link: '/dashboard' },
    { title: '제품 관리', link: '/dashboard/product' }
  ]
  // Add more with Korean titles as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    const segmentTitleTranslations: Record<string, string> = {
      dashboard: '대시보드',
      employee: '직원 관리',
      product: '제품 관리',
      users: '사용자',
      reports: '보고서',
      analytics: '분석',
      overview: '오버뷰'
    };

    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segmentTitleTranslations[segment] || segment,
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconHistory } from '@tabler/icons-react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const MAX_HISTORY_ITEMS = 7;

export const HistoryTabs = () => {
  const [history, setHistory] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setHistory((prev) => {
      const newHistory = new Set(prev);
      if (pathname) {
        newHistory.add(pathname);
        return new Set(Array.from(newHistory).slice(-MAX_HISTORY_ITEMS));
      }
      return prev;
    });
  }, [pathname]);

  const removeFromHistory = (pathToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const newHistory = new Set(prev);
      newHistory.delete(pathToRemove);
      return newHistory;
    });
  };

  const navigateToPath = (path: string) => {
    router.push(path);
  };

  const segmentTitleTranslations: Record<string, string> = {
    dashboard: '대시보드',
    employee: '직원 관리',
    product: '제품 관리',
    users: '사용자',
    reports: '보고서',
    analytics: '분석',
    overview: '오버뷰'
  };

  const HistoryItems = ({ className }: { className?: string }) => (
    <>
      {Array.from(history).map((path) => (
        <div
          key={path}
          onClick={() => navigateToPath(path)}
          className={cn(
            buttonVariants({
              variant: pathname === path ? 'secondary' : 'outline'
            }),
            'group relative h-8 cursor-pointer text-xs',
            className
          )}
        >
          <span className='max-w-[150px] truncate'>
            {segmentTitleTranslations[path.replace('/dashboard/', '')] ||
              path.replace('/dashboard/', '')}
          </span>
          <Button
            size='icon'
            variant='default'
            className='absolute -top-2 -right-2 hidden h-4 w-4 cursor-pointer items-center justify-center group-hover:flex'
            onClick={(e) => removeFromHistory(path, e)}
          >
            <X size={12} />
          </Button>
        </div>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop view */}
      <div className='my-2 hidden flex-wrap gap-2 md:flex'>
        <HistoryItems />
      </div>

      {/* Mobile view */}
      <div className='my-2 md:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm' className='h-8 w-full'>
              <IconHistory className='mr-1 h-4 w-4' />
              기록 탭 ({history.size})
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='w-[200px]'
            sideOffset={10}
          >
            {Array.from(history).map((path) => (
              <DropdownMenuItem
                key={path}
                onClick={() => navigateToPath(path)}
                className={cn(
                  'flex items-center justify-between',
                  pathname === path && 'bg-accent font-medium'
                )}
              >
                <span className='max-w-[150px] truncate'>
                  {segmentTitleTranslations[path.replace('/dashboard/', '')] ||
                    path.replace('/dashboard/', '')}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

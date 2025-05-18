import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { Breadcrumbs } from '../breadcrumbs';
import { UserNav } from './user-nav';
import { ModeToggle } from './ThemeToggle/theme-toggle';
import { HistoryTabs } from '@/components/nav-history-tabs';

export default function Header() {
  return (
    <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
      <div className='flex items-center gap-1 px-4'>
        <SidebarTrigger className='-ml-1' />
        <Separator orientation='vertical' className='mr-1 h-4' />
        <Breadcrumbs />
        <HistoryTabs />
      </div>

      <div className='flex items-center gap-4 px-4'>
        <ModeToggle />
        <UserNav />
      </div>
    </header>
  );
}

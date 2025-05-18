'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Only show theme toggle after mounting to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newMode);
        return;
      }

      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        setTheme(newMode);
      });
    },
    [resolvedTheme, setTheme]
  );

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) {
    return (
      <Button variant='secondary' size='icon' className='group/toggle size-8'>
        <span className='sr-only'>테마 전환</span>
      </Button>
    );
  }

  return (
    <Button
      variant='secondary'
      size='icon'
      className='group/toggle size-8'
      onClick={handleThemeToggle}
      suppressHydrationWarning
    >
      {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
      <span className='sr-only'>테마 전환</span>
    </Button>
  );
}

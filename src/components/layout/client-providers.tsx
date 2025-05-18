'use client';

import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Provider as ReduxProvider } from 'react-redux';
import store from '@/store/store';
import NextTopLoader from 'nextjs-toploader';
import { cn } from '@/lib/utils';
import { fontVariables } from '@/lib/font';
import { ReactNode } from 'react';

export default function ClientProviders({
  children,
  activeThemeValue
}: {
  children: ReactNode;
  activeThemeValue?: string;
}) {
  const isScaled = activeThemeValue?.endsWith('-scaled');

  return (
    <div
      className={cn(
        'bg-background overflow-hidden overscroll-none font-sans antialiased',
        activeThemeValue ? `theme-${activeThemeValue}` : '',
        isScaled ? 'theme-scaled' : '',
        fontVariables
      )}
    >
      <NextTopLoader showSpinner={false} />
      <NuqsAdapter>
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <Providers activeThemeValue={activeThemeValue || 'light'}>
            <ReduxProvider store={store}>
              <Toaster position='top-right' />
              {children}
            </ReduxProvider>
          </Providers>
        </ThemeProvider>
      </NuqsAdapter>
    </div>
  );
}

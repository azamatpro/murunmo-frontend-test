'use client';

import type { Table } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CheckIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { exportToExcel } from '@/lib/export-excel';
import { useMemo } from 'react';
import { toast } from 'sonner';
import UsersPdfDocument from '@/lib/export-pdf';
import dynamic from 'next/dynamic';
import usersData from '@/constants/users.json';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>
  }
);

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table
}: DataTableViewOptionsProps<TData>) {
  const columns = useMemo(
    () =>
      table
        .getAllColumns()
        .filter(
          (column) =>
            typeof column.accessorFn !== 'undefined' && column.getCanHide()
        ),
    [table]
  );

  const handleExportExcel = async () => {
    try {
      const success = await exportToExcel(usersData, 'users_data');
      if (!success) {
        toast.error('Failed to export to excel');
      }
      toast.success('Exported to excel successfully');
    } catch (error) {
      toast.error('Failed to export to excel');
    }
  };

  return (
    <Popover>
      <Button
        onClick={handleExportExcel}
        aria-label='Export to Excel'
        variant='secondary'
        size='sm'
        className='ml-auto hidden h-8 lg:flex'
      >
        <ArrowUp />
        엑셀로 내보내기
      </Button>

      <PDFDownloadLink
        document={<UsersPdfDocument data={usersData} />}
        fileName='users_data.pdf'
      >
        {({ loading, url }) => (
          <Button
            aria-label='Print to PDF'
            variant='secondary'
            size='sm'
            className='ml-auto hidden h-8 lg:flex'
            disabled={loading}
            onClick={() => {
              if (!loading && url) {
                toast.success('PDF가 성공적으로 생성되었습니다');
              } else {
                toast.error('PDF를 생성하지 못했습니다');
              }
            }}
          >
            <ArrowDown />
            PDF로 인쇄
          </Button>
        )}
      </PDFDownloadLink>

      <PopoverTrigger asChild>
        <Button
          aria-label='Toggle columns'
          role='combobox'
          variant='outline'
          size='sm'
          className='ml-auto hidden h-8 lg:flex'
        >
          <Settings2 />
          보기
          <CaretSortIcon className='ml-auto opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent align='end' className='w-44 p-0'>
        <Command>
          <CommandInput placeholder='열 검색...' />
          <CommandList>
            <CommandEmpty>열을 찾을 수 없습니다.</CommandEmpty>
            <CommandGroup>
              {columns.map((column) => (
                <CommandItem
                  key={column.id}
                  onSelect={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  <span className='truncate'>
                    {column.columnDef.meta?.label ?? column.id}
                  </span>
                  <CheckIcon
                    className={cn(
                      'ml-auto size-4 shrink-0',
                      column.getIsVisible() ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

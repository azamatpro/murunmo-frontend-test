'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from 'lucide-react';
import { format } from 'date-fns';
import { CellAction } from './cell-action';
import { DEPARTMENT_OPTIONS } from './options';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/constants/mock-api';

export const columns: ColumnDef<User>[] = [
  {
    id: 'order',
    header: () => (
      <div className='flex items-center space-x-2'>
        <span className='text-sm font-medium'>#</span>
      </div>
    ),
    cell: ({ row }) => {
      const orderNumber = row.index + 1;
      return (
        <div className='flex items-center space-x-2'>
          <span className='text-sm'>{orderNumber}</span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='이름' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<User['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: '이름 검색...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    id: 'username',
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='아이디' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<User['username']>()}</div>,
    enableSorting: true
  },
  {
    id: 'department',
    accessorKey: 'department',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='부서' />
    ),
    cell: ({ cell }) => {
      const department = cell.getValue<User['department']>();
      return (
        <Badge variant='outline' className='capitalize'>
          {department}
        </Badge>
      );
    },
    enableColumnFilter: true,
    enableSorting: true,
    meta: {
      label: '부서',
      variant: 'multiSelect',
      options: DEPARTMENT_OPTIONS,
      placeholder: 'Select departments...'
    }
  },
  {
    id: 'position',
    accessorKey: 'position',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='직책' />
    ),
    cell: ({ cell }) => {
      const position = cell.getValue<User['position']>();
      return (
        <Badge variant='outline' className='capitalize'>
          {position}
        </Badge>
      );
    },
    enableSorting: true
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='전화번호' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<User['phoneNumber']>()}</div>,
    enableSorting: true
  },
  {
    id: 'businessDate',
    accessorKey: 'businessDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='업무날짜' />
    ),
    cell: ({ cell }) => {
      const dateValue = cell.getValue<User['businessDate']>();
      try {
        return <div>{format(new Date(dateValue), 'dd/MM/yyyy')}</div>;
      } catch {
        return <div>Invalid Date</div>;
      }
    },
    enableSorting: true
  },
  {
    id: 'isAdmin',
    accessorKey: 'isAdmin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='관리자' />
    ),
    cell: ({ cell }) => (
      <Checkbox
        checked={cell.getValue<User['isAdmin']>()}
        disabled
        aria-label='Administrator status'
      />
    ),
    enableSorting: true
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='행위' />
    ),
    cell: ({ row }) => <CellAction data={row.original} />
  }
];

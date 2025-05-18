'use client';

import { useEffect } from 'react';
import { UserTable } from './users-tables';
import { columns } from './users-tables/columns';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { setFilters, fetchUsers } from '@/store/slices/userSlice';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

type UserListingPage = {};

export default function UserListingPage({}: UserListingPage) {
  const dispatch = useAppDispatch();
  const { filteredRecords: users, totalItems } = useAppSelector(
    (state) => state.users
  );

  const [page] = useQueryState('page', parseAsInteger.withDefault(1));
  const [search] = useQueryState('name', parseAsString.withDefault(''));
  const [pageLimit] = useQueryState('perPage', parseAsInteger.withDefault(10));
  const [departments] = useQueryState(
    'department',
    parseAsString.withDefault('')
  );

  useEffect(() => {
    let departmentsArray: string[] = [];
    if (typeof departments === 'string' && departments) {
      departmentsArray = departments.split('.').filter(Boolean);
    } else if (Array.isArray(departments)) {
      departmentsArray = departments.filter((dep) => typeof dep === 'string');
    }

    dispatch(
      setFilters({
        departments: departmentsArray,
        search: search || undefined,
        page: page || 1,
        limit: pageLimit || 10
      })
    );
    dispatch(fetchUsers());
  }, [dispatch, page, search, pageLimit, departments]);

  return <UserTable data={users} totalItems={totalItems} columns={columns} />;
}

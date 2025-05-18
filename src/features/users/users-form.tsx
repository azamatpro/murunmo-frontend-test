'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { fakeUsers, User } from '@/constants/mock-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { DEPARTMENT_OPTIONS, POSITION_OPTIONS } from './users-tables/options';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/store';
import { addUser, updateUser } from '@/store/slices/userSlice';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.'
  }),
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.'
  }),
  department: z.string().nonempty('Department is required.'),
  position: z.string().nonempty('Position is required.'),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, {
    message: 'Enter a valid phone number.'
  }),
  businessDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Enter a valid date.'
  }),
  isAdmin: z.boolean()
});

export default function UserForm({
  initialData,
  pageTitle
}: {
  initialData: User | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues = {
    name: initialData?.name || '',
    username: initialData?.username || '',
    department: initialData?.department || '',
    position: initialData?.position || '',
    phoneNumber: initialData?.phoneNumber || '',
    businessDate: initialData?.businessDate
      ? new Date(initialData.businessDate).toISOString().split('T')[0]
      : '',
    isAdmin: initialData?.isAdmin || false
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      if (initialData) {
        // Update existing user
        const result = await dispatch(
          updateUser({ id: initialData.id, user: values })
        ).unwrap();

        if (result.success) {
          toast.success('사용자 정보가 성공적으로 수정되었습니다!');
          router.push('/dashboard/users');
        } else {
          toast.error('사용자 정보 수정에 실패했습니다!');
        }
      } else {
        // Add new user via API first (this will write to the JSON file)
        const response = await fakeUsers.addUser(values);

        if (response.success && response.user) {
          // Update Redux store with the new user
          await dispatch(addUser(response.user)).unwrap();

          toast.success('사용자가 성공적으로 추가되었습니다!');
          router.push('/dashboard/users');
        } else {
          toast.error('사용자 추가에 실패했습니다!');
        }
      }
    } catch (error) {
      toast.error('사용자 데이터를 저장하는 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>성명</FormLabel>
                    <FormControl>
                      <Input placeholder='전체 이름 입력' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>아이디</FormLabel>
                    <FormControl>
                      <Input placeholder='사용자 아이디 입력' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='department'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>부서</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='부서 선택' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEPARTMENT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='position'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>직책</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='직책 선택' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {POSITION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>전화번호</FormLabel>
                    <FormControl>
                      <Input
                        type='tel'
                        placeholder='전화번호 입력'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='businessDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>업무 날짜</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='isAdmin'
                render={({ field }) => (
                  <FormItem className='flex items-center space-x-2'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='font-normal'>관리자</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex space-x-4'>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : initialData
                    ? '사용자 수정'
                    : '사용자 추가'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/dashboard/users')}
                disabled={isSubmitting}
              >
                취소
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

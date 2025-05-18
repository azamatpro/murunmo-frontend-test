import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  DuplicateError
} from '@/lib/errors/error-controllers';

import { ErrorHandler } from '@/lib/errors/error-handlers';

const dataFilePath = path.join(process.cwd(), 'src', 'constants', 'users.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const users = JSON.parse(fileContents);

    return NextResponse.json({
      success: true,
      users,
      message: '사용자 목록을 성공적으로 가져왔습니다.'
    });
  } catch (error) {
    throw new DatabaseError('사용자 데이터를 읽는데 실패했습니다.');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user } = body;

    if (!user) {
      throw new ValidationError('사용자 데이터가 필요합니다.');
    }

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const users = JSON.parse(fileContents);

    if (users.some((u: any) => u.username === user.username)) {
      throw new DuplicateError('사용자', '아이디', user.username);
    }

    const maxId = users.length ? Math.max(...users.map((u: any) => u.id)) : 0;
    const newUser = { ...user, id: maxId + 1 };

    users.push(newUser);
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: '사용자가 성공적으로 추가되었습니다.',
      user: newUser
    });
  } catch (error) {
    return ErrorHandler.handle(error as Error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, user } = body;

    if (!id || !user) {
      throw new ValidationError('사용자 ID와 데이터가 모두 필요합니다.');
    }

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const users = JSON.parse(fileContents);

    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) {
      throw new NotFoundError('사용자', id);
    }

    const updatedUser = { id, ...user };
    users[index] = updatedUser;

    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: `ID ${id}의 사용자 정보가 성공적으로 수정되었습니다.`,
      user: updatedUser
    });
  } catch (error) {
    return ErrorHandler.handle(error as Error);
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!id) {
      throw new ValidationError('사용자 ID가 필요합니다.');
    }

    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const users = JSON.parse(fileContents);

    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) {
      throw new NotFoundError('사용자', id);
    }

    users.splice(index, 1);
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: `ID ${id}의 사용자가 성공적으로 삭제되었습니다.`
    });
  } catch (error) {
    return ErrorHandler.handle(error as Error);
  }
}

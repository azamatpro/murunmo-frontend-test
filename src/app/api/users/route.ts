import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'constants', 'users.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const users = JSON.parse(fileContents);

    return NextResponse.json({
      success: true,
      users,
      message: 'Users fetched successfully'
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to read users data'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user } = body;

    // Read current users
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const users = JSON.parse(fileContents);

    // Generate a new ID
    const maxId = users.length ? Math.max(...users.map((u: any) => u.id)) : 0;
    const newUser = { ...user, id: maxId + 1 };

    // Add the new user and write back to file
    users.push(newUser);
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: 'User added successfully',
      user: newUser
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add user'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, user } = body;

    // Read current users
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const users = JSON.parse(fileContents);

    // Find and update the user
    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: `User with ID ${id} not found`
        },
        { status: 404 }
      );
    }

    const updatedUser = { id, ...user };
    users[index] = updatedUser;

    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: `User with ID ${id} updated successfully`,
      user: updatedUser
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update user'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get('id'));

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID is required'
        },
        { status: 400 }
      );
    }

    // Read current users
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const users = JSON.parse(fileContents);

    // Find and remove the user
    const index = users.findIndex((u: any) => u.id === id);
    if (index === -1) {
      return NextResponse.json(
        {
          success: false,
          message: `User with ID ${id} not found`
        },
        { status: 404 }
      );
    }

    users.splice(index, 1);

    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      message: `User with ID ${id} deleted successfully`
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete user'
      },
      { status: 500 }
    );
  }
}

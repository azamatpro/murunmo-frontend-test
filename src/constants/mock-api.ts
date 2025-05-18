import { matchSorter } from 'match-sorter';
import usersData from './users.json';

export interface User {
  id: number;
  name: string;
  username: string;
  department: string;
  position: string;
  phoneNumber: string;
  businessDate: string;
  isAdmin: boolean;
}

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const userStore = {
  records: usersData as User[],
  initialized: false
};

const fakeUserData = {
  instanceId: Math.random().toString(36).substring(2),

  initialize() {
    if (userStore.initialized && userStore.records.length > 0) {
      return;
    }
    userStore.records = usersData as User[];
    userStore.initialized = true;
  },

  async getAll({
    departments = [],
    search
  }: {
    departments?: string[];
    search?: string;
  }) {
    let users = [...userStore.records];
    if (departments.length > 0) {
      users = users.filter((user) => departments.includes(user.department));
    }
    if (search) {
      users = matchSorter(users, search, { keys: ['name', 'username'] });
    }
    return users;
  },

  async getUsers({
    page = 1,
    limit = 10,
    departments,
    search
  }: {
    page?: number;
    limit?: number;
    departments?: string;
    search?: string;
  }) {
    try {
      // First try getting users from the API
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update the local store
          userStore.records = data.users;
        }
      }
    } catch (error) {}

    // Apply filters
    const departmentsArray = departments ? departments.split('.') : [];
    const allUsers = await this.getAll({
      departments: departmentsArray,
      search
    });

    // Calculate pagination
    const totalUsers = allUsers.length;
    const offset = (page - 1) * limit;
    const paginatedUsers = allUsers.slice(offset, offset + limit);
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: 'User data retrieved successfully',
      total_users: totalUsers,
      offset,
      limit,
      users: paginatedUsers
    };
  },

  async getUserById(id: number) {
    await delay(300);

    const user = userStore.records.find((user) => user.id === id);
    if (!user) {
      return {
        success: false,
        message: `User with ID ${id} not found`
      };
    }
    const currentTime = new Date().toISOString();
    return {
      success: true,
      time: currentTime,
      message: `User with ID ${id} found`,
      user
    };
  },

  async addUser(user: Omit<User, 'id'>) {
    try {
      // Try to add via API first
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          // Update local cache
          userStore.records.push(result.user);
          return result;
        }
      }
    } catch (error) {}

    // Local fallback
    await delay(300);
    const maxId = userStore.records.length
      ? Math.max(...userStore.records.map((u) => u.id))
      : 0;
    const newUser: User = { ...user, id: maxId + 1 };
    userStore.records.push(newUser);
    return {
      success: true,
      message: 'User added successfully (local only)',
      user: newUser
    };
  },

  async deleteUser(id: number) {
    try {
      // Try to delete via API first
      const response = await fetch(`/api/users?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Update local cache
          const index = userStore.records.findIndex((user) => user.id === id);
          if (index !== -1) {
            userStore.records.splice(index, 1);
          }
          return result;
        }
      }
    } catch (error) {}

    // Local fallback
    await delay(300);
    const index = userStore.records.findIndex((user) => user.id === id);
    if (index === -1) {
      return {
        success: false,
        message: `User with ID ${id} not found`
      };
    }
    userStore.records.splice(index, 1);
    return {
      success: true,
      message: `User with ID ${id} deleted successfully (local only)`
    };
  },

  async updateUser(id: number, updatedUser: Omit<User, 'id'>) {
    try {
      // Try to update via API first
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, user: updatedUser })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          // Update local cache
          const index = userStore.records.findIndex((user) => user.id === id);
          if (index !== -1) {
            userStore.records[index] = result.user;
          }
          return result;
        }
      }
    } catch (error) {}

    // Local fallback
    await delay(300);
    const index = userStore.records.findIndex((user) => user.id === id);
    if (index === -1) {
      return {
        success: false,
        message: `User with ID ${id} not found`
      };
    }
    const newUser: User = { id, ...updatedUser };
    userStore.records[index] = newUser;
    return {
      success: true,
      message: `User with ID ${id} updated successfully (local only)`,
      user: newUser
    };
  }
};

fakeUserData.initialize();
export const fakeUsers = Object.freeze(fakeUserData);

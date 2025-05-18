import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fakeUsers, User } from '@/constants/mock-api';

interface UserState {
  filteredRecords: User[];
  totalItems: number;
  loading: boolean;
  error: string | null;
  filters: {
    departments: string[];
    search?: string;
    page: number;
    limit: number;
  };
}

const initialState: UserState = {
  filteredRecords: [],
  totalItems: 0,
  loading: false,
  error: null,
  filters: {
    departments: [],
    search: '',
    page: 1,
    limit: 10
  }
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { users: UserState };
      const { filters } = state.users;

      const response = await fakeUsers.getUsers({
        page: filters.page,
        limit: filters.limit,
        departments: filters.departments.join('.'),
        search: filters.search
      });

      return {
        users: response.users,
        totalItems: response.total_users
      };
    } catch (error) {
      return rejectWithValue('Failed to fetch users');
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (user: Omit<User, 'id'>, { dispatch, rejectWithValue }) => {
    try {
      const response = await fakeUsers.addUser(user);

      if (response.success && response.user) {
        return response.user;
      } else {
        return rejectWithValue(response.message || 'Failed to add user');
      }
    } catch (error) {
      return rejectWithValue('An error occurred while adding user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (
    { id, user }: { id: number; user: Omit<User, 'id'> },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await fakeUsers.updateUser(id, user);

      if (response.success) {
        // Refresh the user list to get updated data
        await dispatch(fetchUsers());
        return { success: true, user: response.user };
      } else {
        return rejectWithValue(response.message || 'Failed to update user');
      }
    } catch (error) {
      return rejectWithValue('An error occurred while updating user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await fakeUsers.deleteUser(id);

      if (response.success) {
        // Refresh the user list after deletion
        await dispatch(fetchUsers());
        return { success: true, id };
      } else {
        return rejectWithValue(response.message || 'Failed to delete user');
      }
    } catch (error) {
      return rejectWithValue('An error occurred while deleting user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = {
        ...state.filters,
        ...action.payload
      };

      // Reset to page 1 when filters change (except when changing page)
      if (!action.payload.hasOwnProperty('page')) {
        state.filters.page = 1;
      }
    },
    clearFilters(state) {
      state.filters = { ...initialState.filters };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredRecords = action.payload.users;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add user
      .addCase(addUser.fulfilled, (state, action) => {
        const newUser = action.payload;

        // Only add to the current list if it matches the current filters
        const { departments, search } = state.filters;
        let shouldAdd = true;

        // Check if the user matches department filter
        if (
          departments.length > 0 &&
          !departments.includes(newUser.department)
        ) {
          shouldAdd = false;
        }

        // Check if user matches search filter (if any)
        if (
          search &&
          !(
            newUser.name.toLowerCase().includes(search.toLowerCase()) ||
            newUser.username.toLowerCase().includes(search.toLowerCase())
          )
        ) {
          shouldAdd = false;
        }

        // Add to the current view if it matches filters
        if (shouldAdd && state.filteredRecords.length < state.filters.limit) {
          state.filteredRecords.push(newUser);
        }

        // Always increment total count
        state.totalItems += 1;
      });
  }
});

export const { setFilters, clearFilters } = userSlice.actions;
export default userSlice.reducer;

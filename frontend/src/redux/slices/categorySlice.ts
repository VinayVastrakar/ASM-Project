import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoryApi, Category } from '../../api/category.api';

export interface CategoryState {
  categories: Category[];  // ✅ Add this
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],  // ✅ Add this
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const response = await categoryApi.getCategories();
    return response;
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (category: Omit<Category, 'id'>, { rejectWithValue }) => {
    try {
      const response = await categoryApi.addCategory(category);
      return response.data;
    } catch (error: any) {
      // Handle the structured error response from backend
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || 'Failed to add category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, category }: { id: number; category: Omit<Category, 'id'> }, { rejectWithValue }) => {
    try {
      const response = await categoryApi.updateCategory(id, category);
      return response.data;
    } catch (error: any) {
      // Handle the structured error response from backend
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue(error.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: number) => {
    await categoryApi.deleteCategory(id);
    return id;
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
    .addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;  // ✅ Store the categories
    })
    .addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch categories';
    })
    // Add Category
    .addCase(addCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories.push(action.payload);  // ✅ Add new category
    })
    // Update Category
    .addCase(updateCategory.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.categories.findIndex(cat => cat.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;  // ✅ Update category
      }
    })
    // Delete Category
    .addCase(deleteCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = state.categories.filter(cat => cat.id !== action.payload);  // ✅ Remove category
    });
  },
});

export const { clearError } = categorySlice.actions;
export default categorySlice.reducer; 
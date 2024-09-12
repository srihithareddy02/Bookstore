import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import books from './data';

interface Book {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
}

interface BooksState {
  books: Book[];
}

const initialState: BooksState = {
  books: books,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Book>) => {
      state.books.push(action.payload);
    },
    updateBook: (state, action: PayloadAction<Book>) => {
      const index = state.books.findIndex(book => book.id === action.payload.id);
      if (index !== -1) {
        state.books[index] = action.payload;
      }
    },
    deleteBook: (state, action: PayloadAction<number>) => {
      console.log(action.payload)
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload)
      };
    }
    
  },
});

export const { addBook,updateBook,deleteBook } = booksSlice.actions;
export default booksSlice.reducer;

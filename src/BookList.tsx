import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Snackbar,
} from "@mui/material";
import { addBook, deleteBook, updateBook } from "./booksSlice";
import { RootState } from "./store";
import IconButton from '@mui/material/IconButton';
import { Close } from "@mui/icons-material";



interface Book {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
}

const BookList: React.FC = () => {
  const dispatch = useDispatch();
  const books = useSelector((state: RootState) => state.books.books);
  const [open, setOpen] = useState(false);
  const [newBook, setNewBook] = useState({
    id: 0,
    title: "",
    price: 0,
    category: "",
    description: "",
  });
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [titleError, setTitleError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  console.log({ books });
  const handleOpen = (book: Book | null) => {
    setOpen(true);
    if (book) {
      setEditingBook(book);
      setNewBook(book);
    } else {
      setEditingBook(null);
      setNewBook({ id: 0, title: "", price: 0, category: "", description: "" });
    }
  };

  const handleClose = () => setOpen(false);
  const handleDelete = (
    id: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    console.log("Delete book with ID:", id);
    dispatch(deleteBook(id));
    showSnackbar("Book deleted successfully");
  };

  const handleSave = () => {
    setTitleError("");
    setPriceError("");
    setCategoryError("");

    let isValid = true;

    if (!newBook.title) {
      setTitleError("Title is required");
      isValid = false;
    }

    if (!newBook.price) {
      setPriceError("Price is required");
      isValid = false;
    }

    if (isNaN(newBook.price)) {
      setPriceError("Price must be a number");
      isValid = false;
    }

    if (!newBook.category) {
      setCategoryError("Category is required");
      isValid = false;
    }

    if (isValid) {
      if (editingBook) {
        dispatch(updateBook({ ...newBook }));
        showSnackbar("Book updated successfully");
      } else {
        const newId = books.length + 1;
        dispatch(addBook({ ...newBook, id: newId }));
        showSnackbar("Book added successfully");
      }
      handleClose();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Book
  ) => {
    setNewBook({ ...newBook, [field]: e.target.value });
  };

  // Render the list of books
  return (
    <main>
      <Box display="flex" justifyContent="flex-end" mb={2} mt={2}>
        <Button
          variant="contained"
          style={{ backgroundColor: "#003479" }}
          onClick={() => handleOpen(null)}
        >
          Add Book
        </Button>
      </Box>
      <Typography variant="h4" style={{ marginBottom: "20px" }}>
        Books List
      </Typography>
      <List>
        {books.map((book: Book) => (
          <ListItem
            key={book?.id}
            divider
            onClick={() => handleOpen(book)}
            style={{
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              marginBottom: "10px",
              borderRadius: "4px",
              backgroundColor: "#fff",
            }}
          >
            <ListItemText
              primary={book?.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" display="block">
                    Price: ${book?.price}
                  </Typography>
                  <Typography component="span" variant="body2" display="block">
                    Category: {book?.category}
                  </Typography>
                  <Typography component="span" variant="body2" display="block">
                    Description: {book?.description}
                  </Typography>
                </>
              }
            />
            <Button
              variant="contained"
              style={{ backgroundColor: "#003479" }}
              onClick={(e) => handleDelete(book?.id, e)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "80%",
            maxWidth: "600px",
          },
        }}
      >
        <DialogTitle>Add a New Book</DialogTitle>
        <DialogContent>
          <Box mb={2} mt={2}>
            <TextField
              label="Book Title"
              fullWidth
              variant="outlined"
              value={newBook.title}
              onChange={(e) => handleChange(e, "title")}
              error={!!titleError}
              helperText={titleError}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Price"
              fullWidth
              variant="outlined"
              value={newBook.price}
              onChange={(e) => handleChange(e, "price")}
              error={!!priceError}
              helperText={priceError}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Category"
              fullWidth
              variant="outlined"
              value={newBook.category}
              onChange={(e) => handleChange(e, "category")}
              error={!!categoryError}
              helperText={categoryError}
            />
          </Box>
          <Box mb={2}>
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={newBook.description}
              onChange={(e) => handleChange(e, "description")}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        ContentProps={{
          sx: {
            backgroundColor: "green",
          },
        }}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <Close fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </main>
  );
};

export default BookList;

import React from 'react';
import './App.css';
import BookList from './BookList';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';

function App() {
  return (
    <div className="App">
      <AppBar position="static" style={{ backgroundColor: '#003479' }}>
        <Toolbar>
          <Typography variant="h6">
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <BookList />
      </Container>

      <footer style={{ marginTop: '20px', textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          © 2024 Bookstore by Nuthan Reddy Tippireddy
        </Typography>
      </footer>
    </div>
  );
}

export default App;

// App.js
// import React from 'react';
// import Form from './Form';

// const App = () => {
//   return (
//     <div>
//       <Form />
//     </div>
//   );
// };

// export default App;

// src/App.js
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './pages/HomePage';
import InvoicePage from './pages/InvoicePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#f0f0f0', // Milky white background
    },
    secondary: {
      main: '#000000', // Black color
    },
    background: {
      default: '#ffffff', // White background
    },
    text: {
      primary: '#000000', // Black color
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          {' '}
          {/* Use the CSS class here */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profoma-invoice" element={<InvoicePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;

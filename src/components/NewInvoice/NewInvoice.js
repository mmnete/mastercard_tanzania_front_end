import React, { useState } from 'react';
import Box from '@mui/material/Box';
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Grid,
  Typography,
} from '@mui/material';
import './NewInvoice.css';
import { formatCurrencyTZS } from '../../utils/MoneyUtils'; // Import the utility function

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function NewInvoice() {
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [vatNo, setVatNo] = useState('');
  const [tin, setTin] = useState('');
  const [item, setItem] = useState('');
  const [partNo, setPartNo] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [taxRate, setTaxRate] = useState(5);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handlePriceChange = (e) => {
    let newValue = e.target.value;
    // Allow only numbers and a single decimal point
    newValue = newValue.replace(/[^0-9.]/g, '');
    // Check if there is more than one decimal point
    const parts = newValue.split('.');
    if (parts.length > 2) {
      newValue = parts[0] + '.' + parts.slice(1).join('');
    }
    // Format the number with commas as thousands separators
    if (newValue) {
      const [integerPart, decimalPart] = newValue.split('.');
      const formattedIntegerPart = parseFloat(integerPart).toLocaleString();
      newValue =
        decimalPart !== undefined
          ? `${formattedIntegerPart}.${decimalPart}`
          : formattedIntegerPart;
    }
    setPrice(newValue);
  };

  const addItem = () => {
    if (!validateAddItemForm()) {
      return;
    }

    let id = items.length * 123;
    let realPrice = price.replace(',', '');
    const total = parseFloat(quantity) * parseFloat(realPrice);
    const newItem = { id, item, partNo, quantity, realPrice, total };
    setItems([...items, newItem]);
    setItem('');
    setPartNo('');
    setQuantity('');
    setPrice('');
  };

  const validateAddItemForm = () => {
    if (!partNo || !item || !quantity || !price) {
      alert('Please fill in all fields for the item.');
      return false;
    }
    return true;
  };

  const deleteSelectedItems = () => {
    const remainingItems = items.filter((item) => {
      for (var selectItem of selectedItems) {
        if (selectItem.id === item.id) {
          return false; // Return false to exclude matched item
        }
      }
      return true; // Return true to include unmatched item
    });
    setItems(remainingItems);
    setSelectedItems([]);
  };

  const calculateTax = () => {
    if (items.length === 0) {
      return 0;
    }
    return (
      items.reduce((acc, item) => acc + parseFloat(item.total), 0) *
      (taxRate / 100)
    );
  };

  const calculateTotal = () => {
    if (items.length === 0) {
      return 0;
    }
    return (
      items.reduce((acc, item) => acc + parseFloat(item.total), 0) +
      calculateTax()
    );
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelectedItems(items);
      return;
    }
    setSelectedItems([]);
  };

  const handleSelectClick = (item) => {
    const selectedIndex = selectedItems.indexOf(item);
    let newSelectedItems = [];

    // If the item is already selected, remove it from the selected items
    if (selectedIndex !== -1) {
      newSelectedItems = selectedItems.filter(
        (selectedItem) => selectedItem !== item
      );
    } else {
      // If the item is not selected, add it to the selected items
      newSelectedItems = [...selectedItems, item];
    }

    setSelectedItems(newSelectedItems);
  };

  const handleSubmitInvoice = () => {
    if (!validateSubmitInvoiceForm()) {
      return;
    }
    window.print(); // Trigger printing of the whole web page
  };

  const validateSubmitInvoiceForm = () => {
    if (taxRate <= 0.00001) {
      alert("Please enter a valid tax rate.");
      return;
    }
    if (items.length === 0) {
      alert('Please add atleast 1 item.');
      return false;
    }
    return true;
  };

  return (
    <div className="form">
      <Typography variant="h4" gutterBottom className="title">
        New Invoice
      </Typography>
      <Typography variant="h5" gutterBottom className="title">
        Description
      </Typography>
      <TextField
        label="VAT Reg. No"
        value={vatNo}
        onChange={(e) => setVatNo(e.target.value)}
        fullWidth
        autoComplete="off"
        style={{ width: '60%', height: '3rem' }}
      />
      <br />
      <br />

      <TextField
        label="Taxpayer Identification Number (TIN)"
        value={tin}
        onChange={(e) => setTin(e.target.value)}
        fullWidth
        autoComplete="off"
        style={{ width: '60%', height: '3rem' }}
      />
      <br />
      <br />

      <TextField
        label="Select Date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          max: getCurrentDate(), // Optionally limit to today's date or past dates
        }}
      />
      <br />
      <br />

      <Typography variant="h5" gutterBottom className="title">
        Items
      </Typography>

      <Grid container spacing={1}>
        <Grid item xs={3}>
          <TextField
            label="Part No."
            value={partNo}
            onChange={(e) => setPartNo(e.target.value)}
            required
            fullWidth
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={3.5}>
          <TextField
            label="Item"
            value={item}
            onChange={(e) => setItem(e.target.value)}
            required
            fullWidth
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={3.5}>
          <TextField
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            InputProps={{ inputProps: { min: 1 } }}
            required
            fullWidth
            autoComplete="off"
          />
        </Grid>
        <Grid item xs={3.5}>
          <TextField
            type="text"
            label="Price / PC"
            value={price}
            autoComplete="off"
            onChange={handlePriceChange}
            InputProps={{
              style: { textAlign: 'right' },
            }}
            required
            fullWidth
          />
        </Grid>
      </Grid>
      <br />

      <Button variant="contained" onClick={addItem} sx={{ minWidth: '100px' }}>
        Add Item
      </Button>
      <br />
      <br />

      {selectedItems.length > 0 && (
        <Button
          variant="contained"
          onClick={deleteSelectedItems}
          aria-label="Delete selected items"
          sx={{ color: 'red', minWidth: '100px' }} // Ensure the button is read
        >
          Delete
        </Button>
      )}
      <br />
      <br />

      <Table className="table">
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                sx={{
                  '& .MuiSvgIcon-root': {
                    fill: '#1976d2', // Custom checkbox color
                  },
                  '& .MuiTypography-root': {
                    color: '#1976d2', // Custom label color
                  },
                }}
                indeterminate={
                  selectedItems.length > 0 &&
                  selectedItems.length < items.length
                }
                checked={
                  items.length > 0 && selectedItems.length === items.length
                }
                onChange={handleSelectAllClick}
                inputProps={{ 'aria-label': 'select all items' }}
              />
            </TableCell>
            <TableCell sx={{ fontSize: '0.7rem', padding: '5px' }}>
              Part No.
            </TableCell>
            <TableCell sx={{ fontSize: '0.7rem', padding: '5px' }}>
              Item
            </TableCell>
            <TableCell sx={{ fontSize: '0.7rem', padding: '5px' }}>
              Quantity
            </TableCell>
            <TableCell sx={{ fontSize: '0.7rem', padding: '5px' }}>
              Price
            </TableCell>
            <TableCell sx={{ fontSize: '0.7rem', padding: '5px' }}>
              Total
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  p={2}
                >
                  <Box
                    component="img"
                    src={require('../../assets/images/empty_icon.png')}
                    alt="Empty Icon"
                    sx={{
                      width: '35px',
                      height: '44px',
                      borderRadius: '10px',
                    }}
                  />
                  <Typography variant="h8" color="textSecondary">
                    No items available
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow
                key={index}
                selected={selectedItems.indexOf(index) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fill: '#1976d2', // Custom checkbox color
                      },
                      '& .MuiTypography-root': {
                        color: '#1976d2', // Custom label color
                      },
                    }}
                    checked={selectedItems.indexOf(item) !== -1}
                    onChange={() => handleSelectClick(item)}
                    inputProps={{
                      'aria-labelledby': `checkbox-list-label-${index}`,
                    }}
                  />
                </TableCell>
                <TableCell
                  className="table-cell truncate-text"
                  sx={{ fontSize: '0.7rem', padding: '5px' }}
                >
                  {item.partNo}
                </TableCell>
                <TableCell
                  className="table-cell truncate-text"
                  sx={{ fontSize: '0.7rem', padding: '5px' }}
                >
                  {item.item}
                </TableCell>
                <TableCell sx={{ fontSize: '0.7rem', padding: '5px' }}>
                  {item.quantity}
                </TableCell>
                <TableCell sx={{ fontSize: '0.7rem', padding: '5px' }}>
                  {formatCurrencyTZS(parseFloat(item.realPrice))}
                </TableCell>
                <TableCell
                  className="table-cell truncate-text"
                  sx={{ fontSize: '0.7rem', padding: '5px' }}
                >
                  {formatCurrencyTZS(parseFloat(item.total))}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <br />

      <TextField
        type="number"
        label="Tax Rate (%)"
        autoComplete="off"
        value={taxRate}
        onChange={(e) => setTaxRate(e.target.value)}
        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
        required
        fullWidth
      />
      <br />
      <br />

      <TextField
        label="Tax"
        autoComplete="off"
        value={`${formatCurrencyTZS(calculateTax())}`}
        InputProps={{ readOnly: true }}
        fullWidth
      />
      <br />
      <br />

      <TextField
        label="Total"
        autoComplete="off"
        value={`${formatCurrencyTZS(calculateTotal())}`}
        InputProps={{ readOnly: true }}
        fullWidth
      />
      <br />
      <br />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleSubmitInvoice}
      >
        Submit Invoice
      </Button>
    </div>
  );
}

export default NewInvoice;

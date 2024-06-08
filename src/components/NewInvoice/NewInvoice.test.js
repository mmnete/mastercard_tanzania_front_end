// NewInvoice.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewInvoice from './NewInvoice';
import { formatCurrencyTZS } from '../../utils/MoneyUtils';

test('renders empty table with no items', () => {
  render(<NewInvoice />);
  expect(screen.getByText(/No items available/i)).toBeInTheDocument();
});

test('adds item to the table', () => {
  render(<NewInvoice />);

  fireEvent.change(screen.getByLabelText(/Item/i), {
    target: { value: 'Test Item' },
  });
  fireEvent.change(screen.getByLabelText(/Quantity/i), {
    target: { value: '2' },
  });
  fireEvent.change(screen.getByLabelText(/Price per PC/i), {
    target: { value: '100' },
  });
  fireEvent.click(screen.getByText(/Add Item/i));

  expect(screen.getByText('Test Item')).toBeInTheDocument();
  expect(screen.getByText('2')).toBeInTheDocument();
  expect(screen.getByText(formatCurrencyTZS(100))).toBeInTheDocument();
  expect(screen.getByText(formatCurrencyTZS(200))).toBeInTheDocument();
});

test('calculates tax and total correctly', () => {
  render(<NewInvoice />);

  fireEvent.change(screen.getByLabelText(/Item/i), {
    target: { value: 'Test Item' },
  });
  fireEvent.change(screen.getByLabelText(/Quantity/i), {
    target: { value: '2' },
  });
  fireEvent.change(screen.getByLabelText(/Price per PC/i), {
    target: { value: '100' },
  });
  fireEvent.click(screen.getByText(/Add Item/i));

  fireEvent.change(screen.getByLabelText(/Tax Rate/i), {
    target: { value: '10' },
  });

  const tax = 2 * 100 * 0.1;
  const total = 2 * 100 + tax;

  expect(screen.getByLabelText(/Tax/i).value).toBe(formatCurrencyTZS(tax));
  expect(screen.getByLabelText(/Total/i).value).toBe(formatCurrencyTZS(total));
});

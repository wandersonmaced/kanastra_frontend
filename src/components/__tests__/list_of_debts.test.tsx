import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import { ListOfCsvData } from '../ui/list-csv-data';

// Mock axios.get
jest.mock('axios');

describe('ListOfCsvData component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading message while fetching data', async () => {
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: [], count: 0 });
    const { getByText } = render(<ListOfCsvData />);
    expect(getByText('Loading...')).toBeTruthy();
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });

  test('renders error message when data fetching fails', async () => {
    const errorMessage = 'Failed to fetch data';
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    const { getByText } = render(<ListOfCsvData />);
    await waitFor(() => expect(getByText(errorMessage)).toBeTruthy());
  });

  test('renders table when data is fetched successfully', async () => {
    const mockData = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        amount: 100,
        governmentId: '12345',
        debtAmount: 50,
        debtDueDate: '2024-12-31',
        debtId: 'ABC123',
        created_at: '2024-04-01T00:00:00.000Z',
      },
    ];
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockData, count: 1 });
    const { getByText } = render(<ListOfCsvData />);
    await waitFor(() => expect(getByText('Table of Debts')).toBeTruthy());
    expect(getByText('John Doe')).toBeTruthy();
  });
});

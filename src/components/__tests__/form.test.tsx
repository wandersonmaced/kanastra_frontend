import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import {FileUploadForm} from '../ui/form';


jest.mock('axios');

describe('FileUploadForm component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders file upload form correctly', () => {
    render(<FileUploadForm />);
    expect(screen.getByText('Drop your CSV Files Here:')).toBeTruthy();
  });

  test('displays error message for invalid file type', async () => {
    render(<FileUploadForm />);
    const dropzoneInput = screen.getByRole('button');
    fireEvent.change(dropzoneInput, {
      target: {
        files: [new File(['content'], 'test.txt', { type: 'text/plain' })],
      },
    });
    expect(await screen.findByText('Please select only CSV files.')).toBeTruthy();
  });

  test('displays upload progress and success message on successful upload', async () => {
    const mockedResponse = {
      data: 'File uploaded successfully',
    };
    (axios.post as jest.Mock).mockResolvedValueOnce(mockedResponse);

    render(<FileUploadForm />);
    const dropzoneInput = screen.getByRole('button');
    fireEvent.change(dropzoneInput, {
      target: {
        files: [new File(['content'], 'test.csv', { type: 'text/csv' })],
      },
    });

    await waitFor(() => expect(screen.getByText('File upload complete')).toBeTruthy());
    expect(screen.getByText('Chunk 1/1 uploaded successfully')).toBeTruthy();
    expect(screen.getByText('File uploaded successfully')).toBeTruthy();
  });

  test('displays error message on upload failure', async () => {
    const mockedError = new Error('Upload failed');
    (axios.post as jest.Mock).mockRejectedValueOnce(mockedError);

    render(<FileUploadForm />);
    const dropzoneInput = screen.getByRole('button');
    fireEvent.change(dropzoneInput, {
      target: {
        files: [new File(['content'], 'test.csv', { type: 'text/csv' })],
      },
    });

    await waitFor(() => expect(screen.getByText('Upload failed. Please try again later.')).toBeTruthy());
  });
});

import React, { useReducer, useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from './table


enum ActionType {
  FETCH_REQUEST = 'FETCH_REQUEST',
  FETCH_SUCCESS = 'FETCH_SUCCESS',
  FETCH_FAILURE = 'FETCH_FAILURE',
}


interface Action {
  type: ActionType;
  payload?: any;
}

interface State {
  data: any[];
  loading: boolean;
  error: string | null;
  next: string | null;
  previous: string | null;
  count: number;
}

const initialState: State = {
  data: [],
  loading: false,
  error: null,
  next: null,
  previous: null,
  count: 0,
};


const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionType.FETCH_REQUEST:
      return { ...state, loading: true, error: null };
    case ActionType.FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.results,
        next: action.payload.next,
        previous: action.payload.previous,
        count: action.payload.count,
      };
    case ActionType.FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};


const ListOfCsvData: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ActionType.FETCH_REQUEST });

      try {
        const response = await axios.get(
          `http://localhost:8000/debts/?page=${currentPage}&page_size=20`
        );
        dispatch({ type: ActionType.FETCH_SUCCESS, payload: response.data });
      } catch (error) {
        dispatch({ type: ActionType.FETCH_FAILURE, payload: error.message });
      }
    };

    fetchData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(state.count / 20); 
    const maxPagesToShow = 5;
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = currentPage - halfMaxPages;
    let endPage = currentPage + halfMaxPages;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(totalPages, maxPagesToShow);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, index) => index + startPage);

    return (
      <div className="mt-4 flex justify-center">
        {pagesToShow.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`${
              currentPage === page
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            } font-medium px-3 py-1 rounded-md mr-2`}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto">
      {state.loading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
      {state.data.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">CSV Data</h2>
          <Table>
            <TableHeader>
              <TableRow>
              <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Government ID</TableHead>
                <TableHead>Debt Amount</TableHead>
                <TableHead>Debt Due Date</TableHead>
                <TableHead>Debt ID</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.governmentId}</TableCell>
                  <TableCell>{item.debtAmount}</TableCell>
                  <TableCell>{item.debtDueDate}</TableCell>
                  <TableCell>{item.debtId}</TableCell>
                  <TableCell>{item.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {renderPagination()}
        </div>
      )}
    </div>
  );
};

export {ListOfCsvData};

// actions.ts

export const FETCH_OBJECTS_REQUEST = 'FETCH_OBJECTS_REQUEST';
export const FETCH_OBJECTS_SUCCESS = 'FETCH_OBJECTS_SUCCESS';
export const FETCH_OBJECTS_FAILURE = 'FETCH_OBJECTS_FAILURE';

interface FetchObjectsRequestAction {
  type: typeof FETCH_OBJECTS_REQUEST;
}

interface FetchObjectsSuccessAction {
  type: typeof FETCH_OBJECTS_SUCCESS;
  payload: Object[]; // Define your object type here
}

interface FetchObjectsFailureAction {
  type: typeof FETCH_OBJECTS_FAILURE;
  payload: string;
}

export type ObjectActionTypes =
  | FetchObjectsRequestAction
  | FetchObjectsSuccessAction
  | FetchObjectsFailureAction;

export const fetchObjectsRequest = (): ObjectActionTypes => ({
  type: FETCH_OBJECTS_REQUEST
});

export const fetchObjectsSuccess = (objects: Object[]): ObjectActionTypes => ({
  type: FETCH_OBJECTS_SUCCESS,
  payload: objects
});

export const fetchObjectsFailure = (error: string): ObjectActionTypes => ({
  type: FETCH_OBJECTS_FAILURE,
  payload: error
});

import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import todosReducer from '../features/todos/todosSlice';
import cartReducer from '../features/cart/cartSlice';
import { logAction, recordStateChange } from './actionLog';

// Middleware: runs on every DISPATCH and records the ACTION type.
// This makes the dispatch -> action -> reducer flow visible in the UI.
const actionLoggerMiddleware = () => (next) => (action) => {
  if (action && typeof action.type === 'string') {
    logAction(action.type);
  }
  return next(action);
};

// STORE: the single source of truth. It combines the slice reducers
// into one global STATE tree: { counter, todos, cart }.
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todosReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(actionLoggerMiddleware),
});

// SUBSCRIBE: Redux calls this listener after every dispatched action
// that changes the state. We use it to count state changes live.
store.subscribe(() => {
  recordStateChange();
});

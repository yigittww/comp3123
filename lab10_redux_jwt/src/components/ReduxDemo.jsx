import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment, incrementByAmount, reset } from '../features/counter/counterSlice';
import { addTodo, removeTodo, toggleTodo } from '../features/todos/todosSlice';
import { PRODUCTS, addToCart, clearCart, removeFromCart } from '../features/cart/cartSlice';

// Every button below calls dispatch(action) — watch the Action Log and the
// live State viewer react to each dispatch.
export default function ReduxDemo() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);
  const todos = useSelector((state) => state.todos.items);
  const cartItems = useSelector((state) => state.cart.items);
  const [amount, setAmount] = useState(5);
  const [todoText, setTodoText] = useState('');

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  function handleAddTodo(e) {
    e.preventDefault();
    if (!todoText.trim()) return;
    dispatch(addTodo(todoText.trim()));
    setTodoText('');
  }

  return (
    <section className="card">
      <h2>Part 1 — Redux (Store, Slices, Dispatch)</h2>
      <div className="redux-grid">
        <div className="mini-card">
          <h3>Counter slice</h3>
          <p className="big-number">{count}</p>
          <div className="btn-row">
            <button onClick={() => dispatch(decrement())}>-1</button>
            <button onClick={() => dispatch(increment())}>+1</button>
            <button onClick={() => dispatch(reset())}>Reset</button>
          </div>
          <div className="btn-row">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="amount-input"
            />
            <button onClick={() => dispatch(incrementByAmount(amount))}>Add amount</button>
          </div>
          <p className="hint">Actions: counter/increment, counter/decrement, counter/incrementByAmount, counter/reset</p>
        </div>

        <div className="mini-card">
          <h3>Todos slice</h3>
          <form onSubmit={handleAddTodo} className="btn-row">
            <input
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              placeholder="New todo…"
            />
            <button type="submit">Add</button>
          </form>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className={todo.done ? 'done' : ''}>
                <label>
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => dispatch(toggleTodo(todo.id))}
                  />
                  {todo.text}
                </label>
                <button className="small" onClick={() => dispatch(removeTodo(todo.id))}>
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <p className="hint">Actions: todos/addTodo, todos/toggleTodo, todos/removeTodo</p>
        </div>

        <div className="mini-card">
          <h3>Cart slice</h3>
          <div className="btn-row wrap">
            {PRODUCTS.map((p) => (
              <button key={p.id} onClick={() => dispatch(addToCart(p))}>
                + {p.name} (${p.price})
              </button>
            ))}
          </div>
          {cartItems.length === 0 ? (
            <p className="hint">Cart is empty.</p>
          ) : (
            <>
              <ul className="cart-list">
                {cartItems.map((item) => (
                  <li key={item.id}>
                    {item.name} × {item.qty} — ${item.price * item.qty}
                    <button className="small" onClick={() => dispatch(removeFromCart(item.id))}>
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <p>
                <b>Total: ${cartTotal}</b>
              </p>
              <button onClick={() => dispatch(clearCart())}>Clear cart</button>
            </>
          )}
          <p className="hint">Actions: cart/addToCart, cart/removeFromCart, cart/clearCart</p>
        </div>
      </div>
    </section>
  );
}

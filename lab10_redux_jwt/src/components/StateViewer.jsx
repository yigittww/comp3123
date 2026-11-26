import { useSelector } from 'react-redux';

// STATE viewer: useSelector subscribes this component to the store,
// so it re-renders with the new state after every dispatch.
export default function StateViewer() {
  const state = useSelector((s) => s);
  return (
    <div className="mini-card">
      <h3>Live State (store.getState())</h3>
      <pre className="state-json">{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}

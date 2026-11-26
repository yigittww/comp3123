// Maps the six Redux concepts from the lab instructions (0-5)
// to the exact place each one lives in this project.
const CONCEPTS = [
  ['0 · State', 'The single object tree held by the store: { counter, todos, cart }. Shown live in the State viewer below.', 'src/app/store.js + State viewer'],
  ['1 · Store', 'configureStore() combines the slice reducers and is provided to React with <Provider>.', 'src/app/store.js'],
  ['2 · Reducer', 'Pure functions (one per slice) that take (state, action) and produce the next state. Redux Toolkit writes them with createSlice + Immer.', 'src/features/ (one *Slice.js per feature)'],
  ['3 · Action', 'Plain objects like { type: "counter/increment", payload: 5 }, created by the generated action creators.', 'counterSlice.actions, todosSlice.actions, cartSlice.actions'],
  ['4 · Dispatch', 'dispatch(action) is the only way to change state. Every button in Part 1 dispatches an action — watch the log.', 'useDispatch() in ReduxDemo.jsx'],
  ['5 · Subscribe', 'store.subscribe(listener) runs after each state change; react-redux useSelector/useSyncExternalStore do the same for the UI.', 'store.subscribe() in store.js + ActionLogPanel.jsx'],
];

export default function ConceptsPanel() {
  return (
    <section className="card">
      <h2>Redux Concepts 0–5 — Where Each One Lives in This App</h2>
      <table className="concepts-table">
        <thead>
          <tr>
            <th>Concept</th>
            <th>What it means here</th>
            <th>File</th>
          </tr>
        </thead>
        <tbody>
          {CONCEPTS.map(([name, desc, file]) => (
            <tr key={name}>
              <td><b>{name}</b></td>
              <td>{desc}</td>
              <td><code>{file}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

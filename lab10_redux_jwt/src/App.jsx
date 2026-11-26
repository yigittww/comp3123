import ReduxDemo from './components/ReduxDemo';
import StateViewer from './components/StateViewer';
import ActionLogPanel from './components/ActionLogPanel';
import ConceptsPanel from './components/ConceptsPanel';
import JwtPanel from './components/JwtPanel';
import './App.css';

export default function App() {
  return (
    <div className="page">
      <header>
        <h1>COMP3123 — Lab Exercise 10</h1>
        <p className="subtitle">
          Self-Directed Research: <b>React Redux</b> &amp; <b>JWT (JSON Web Token)</b>
        </p>
        <p className="subtitle">Yigit Alkoc · Student ID: 101558073</p>
      </header>

      <ReduxDemo />

      <section className="card">
        <h2>Redux — Live State &amp; Action Log</h2>
        <div className="two-col">
          <StateViewer />
          <ActionLogPanel />
        </div>
      </section>

      <ConceptsPanel />

      <JwtPanel />

      <footer>
        <p>
          Frontend: Vite + React + Redux Toolkit · Backend: Express + jsonwebtoken ·
          Run the backend (<code>npm start</code> in <code>server/</code>) before logging in.
        </p>
      </footer>
    </div>
  );
}

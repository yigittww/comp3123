import logo from './logo.svg';
import './App.css';

function StudentInfo(props) {
  return (
      <>
        <h1>Welcome to Fullstack Development - I</h1>
        <h2>React JS Programming Week09 Lab exercise</h2>
        <p>{props.studentId}</p>
        <p>{props.name}</p>
        <p>{props.college}</p>
      </>
  );
}

function App() {
  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <StudentInfo
              studentId="101558073"
              name="Yigit Alkoc"
              college="George Brown College, Toronto"
          />
        </header>
      </div>
  );
}

export default App;
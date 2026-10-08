import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Fib from './Fib';
import OtherPage from "./OtherPage"

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className='App-title'>Welcome to React</h1>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other Page</Link>
        </header>
        <div>
          <Routes>
            <Route path='/' element={<Fib />} />
            <Route path='/otherpage' element={<OtherPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

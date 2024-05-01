import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage, NotFoundPage } from './pages';

function App() {
  return (
    <Router>
    <Routes>
        <Route path="/" element={ <HomePage /> } />
        <Route element={ <NotFoundPage /> } />
    </Routes>
</Router>
  );
}

export default App;

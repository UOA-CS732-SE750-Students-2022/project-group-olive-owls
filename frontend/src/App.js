import logo from './logo.svg';
import './App.css';

import SignIn from './component/signIn';
import Register from './component/register';
import Root from './component/root'
import Menubar from "./component/Menubar";
import {Button} from '@mui/material'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
          <Route path="/login" element={<SignIn />}>
          </Route>
          <Route path="/" element={<Root />}>
            
          </Route>
          <Route path="/register" element={<Register />}>
            
          </Route>
        </Routes>

      </Router>
      
      

    </div>
  );
}

export default App;

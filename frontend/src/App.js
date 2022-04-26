import logo from './logo.svg';
import './App.css';

import SignIn from './component/signIn';
import Register from './component/register';
import Root from './component/root'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
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
            <DndProvider backend={HTML5Backend}>
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
            </DndProvider>

        </div>
    );
}

export default App;

import './App.css';

import SignIn from './component/signIn';
import Register from './component/register';
import Uploadimg from './component/Uploadimg';
import Alert from './component/Alert';
import Root from './component/root';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";



import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import {DragAndDrop} from "./component/DragAndDrop";
import SideBar from "./component/Sidebar";
import Records from './component/Records'
import HomePage from "./pages/HomePage";
import PrivateRoute from './component/privateRoute';

function App() {
    return (
        <div className="App">
            <DndProvider backend={HTML5Backend}>
                <Router>
                    <Routes>
                        <Route path="/login" element={<SignIn />}/>
                        <Route path="/" element={<Root />}/>
                        <Route path="/register" element={<Register />}/>

                        <Route path="/sidebar" element={<SideBar />}/>
                        <Route path="/alert" element={<Alert open={true} />}/>
                        <Route path="/records" element={<PrivateRoute><Records /></PrivateRoute> }/>
                        <Route path="/home" element={<HomePage />}/>
                        <Route path='/uploadimg' element={<Uploadimg />}/>
                    </Routes>

                </Router>
            </DndProvider>

        </div>
    );
}

export default App;

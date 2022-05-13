import './App.css';

import SignIn from './component/signIn';
import Register from './component/register';

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
import PrivateRoute from './component/privateRoute';
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
                        <Route path="/sidebar" element={<SideBar />}/>
                        <Route path="/dnd" element={<DragAndDrop />}/>
                        <Route path="/alert" element={<Alert open={true} />}/>
                        <Route path="/records" element={<PrivateRoute><Records /></PrivateRoute> }/>
                    </Routes>

                </Router>
            </DndProvider>

        </div>
    );
}

export default App;

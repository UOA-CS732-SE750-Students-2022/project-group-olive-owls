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
//imports of components
import {DragAndDrop} from "./component/DragAndDrop";
import SideBar from "./component/Sidebar";
import Records from './component/records/Records'
import BubbleEdit from "./component/Bubble/BubbleEdit";
import AssocEdit from './component/Assoc/AssocEdit';
import EmployeeRecords from "./component/Employees/EmployeeRecords";
import Uploadimg from "./component/Uploadimg";

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

                        
                        <Route path={"/bubble"} element={<PrivateRoute><BubbleEdit /></PrivateRoute>}></Route>
                        <Route path="/associate" element={<PrivateRoute><AssocEdit /></PrivateRoute>}></Route>
                        <Route path="/register" element={<Register />}>

                        </Route>
                        <Route path='/uploadimg' element={<PrivateRoute><Uploadimg /></PrivateRoute>}>

                        </Route>
                        <Route path="/sidebar" element={<SideBar />}/>
                        <Route path="/dnd" element={<DragAndDrop />}/>
                        <Route path="/alert" element={<Alert open={true} />}/>
                        <Route path="/records" element={<PrivateRoute><Records /></PrivateRoute>}/>

                        <Route path="/EmployeeRecords" element={<PrivateRoute><EmployeeRecords /></PrivateRoute>}/>

                    </Routes>

                </Router>
            </DndProvider>

        </div>
    );
}

export default App;

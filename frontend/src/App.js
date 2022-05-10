import './App.css';


import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
//imports of components
import SignIn from './component/signIn';
import Register from './component/register';
import Alert from './component/Alert';
import Root from './component/root';
import {DragAndDrop} from "./component/DragAndDrop";
import SideBar from "./component/Sidebar";
import Records from './component/Records'
import BubbleEdit from "./component/BubbleEdit";

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

                        //adds a new route for the bubble edit
                        <Route path={"/BubbleEdit"} element={<BubbleEdit />}></Route>

                        <Route path="/register" element={<Register />}>

                        </Route>
                        <Route path="/sidebar" element={<SideBar />}/>
                        <Route path="/dnd" element={<DragAndDrop />}/>
                        <Route path="/alert" element={<Alert open={true} />}/>
                        <Route path="/records" element={<Records />}/>
                    </Routes>

                </Router>
            </DndProvider>

        </div>
    );
}

export default App;

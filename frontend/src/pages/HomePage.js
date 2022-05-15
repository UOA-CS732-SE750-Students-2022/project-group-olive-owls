import Menubar from "../component/Menubar";
import styles from "./HomePage.module.css"
import SideBar from "../component/Sidebar";
import {DroppableContainer} from "../component/DroppableContainer";

export default function HomePage() {
    return (
        <div>
            <header>
                <Menubar/>
            </header>
            <div className={styles.container}>
                <div className={styles.sideItem}>
                    <SideBar/>
                </div>
                <DroppableContainer/>

git
            </div>

        </div>
    );
}
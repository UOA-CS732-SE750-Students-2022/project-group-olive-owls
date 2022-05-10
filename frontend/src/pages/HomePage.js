import Menubar from "../component/Menubar";
import styles from "./HomePage.css"
import SideBar from "../component/Sidebar";

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
                <div className={styles.mainPage}>

                </div>


            </div>

        </div>
    );
}
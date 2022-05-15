import Menubar from "../component/Menubar";
import styles from "./HomePage.module.css"
import SideBar from "../component/Sidebar";
import {DroppableContainer} from "../component/DroppableContainer";
import {useState} from "react";
import * as React from "react";
import useGet from "../component/useGet";
import axios from "axios";

export default function HomePage() {

    const [bubbles, setBubbles] = useState(false);

    const getBubbles = async (e) => {
        // e.preventDefault();
        try {
            const res = await axios.get("http://localhost:8010/getbubble",
                {headers: {"Authorization" : "Bearer 1234567890"}}
            );

            if (res.status === 200) {
                console.log("Got List of bubbles successfully");
                setBubbles(res.data);

            } else {
                console.log("Some error occurred");
            }
        } catch (err) {
            console.log(err);
        }
    };

    getBubbles();
    console.log(bubbles);

    return (
        <div>
            <header>
                <Menubar/>
            </header>
            <div className={styles.container}>
                <div className={styles.sideItem}>
                    <SideBar bubbles = { bubbles }/>
                </div>
                <DroppableContainer boxes={ bubbles } setBoxes={ setBubbles }/>

            </div>

        </div>
    );
}
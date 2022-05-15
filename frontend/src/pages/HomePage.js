import Menubar from "../component/Menubar";
import styles from "./HomePage.module.css"
import SideBar from "../component/Sidebar";
import {DroppableContainer} from "../component/DroppableContainer";
import {useEffect, useState} from "react";
import * as React from "react";
import useGet from "../component/useGet";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {

    let array = [];
    let [bubbles, setBubbles] = useState(false);
    const [bubbleData, setBubbleData] = useState(false);
    const [render, setRender] = useState(false);


    const getBubbles = async (e) => {
        // e.preventDefault();
        try {
            const res = await axios.get("http://localhost:8010/getbubble",
                {headers: {"Authorization" : "Bearer 1234567890"}}
            );

            if (res.status === 200) {
                console.log("Got List of bubbles successfully");
                setBubbleData(res.data);

            } else {
                console.log("Some error occurred");
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getBubbles();
    }, []);

    if (bubbleData === false || bubbleData.length == 0) {
        console.log("BubbleData is empty");
    } else {
        console.log("BubbleData not empty");
        console.log(bubbleData);
        bubbleData.map((item,index) => {
            array[index] = {};
            array[index].title = item.bubbleName;
            array[index].top = 20;
            array[index].left = 20 + (index * 75);

        });

        bubbles = array
        console.log(bubbles)
    }



    return (
        <div>
            <header>
                <Menubar/>
            </header>
            <div className={styles.container}>
                <div className={styles.sideItem}>
                    <SideBar bubbles = { bubbles }/>
                </div>
                <DroppableContainer bubbles={ bubbles } setBubbles={ setBubbles } render={ render } setRender={ setRender }/>

            </div>

        </div>
    );
}
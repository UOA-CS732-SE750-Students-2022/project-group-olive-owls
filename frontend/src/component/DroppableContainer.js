import { useCallback, useState } from "react";
import { useDrop } from "react-dnd";
import update from "immutability-helper";
import { ItemTypes } from "./ItemTypes";
import {Bubble} from "./Bubble";
import styles from "../pages/HomePage.module.css"

// const styles = {
//     width: 300,
//     height: 300,
//     border: "1px solid black",
//     position: "relative"
// };
export const DroppableContainer = ({ hideSourceOnDrag }) => {
    const [boxes, setBoxes] = useState({
        a: { top: 20, left: 80, title: "Drag me around" },
        b: { top: 180, left: 20, title: "Drag me too" }
    });
    const moveBox = useCallback(
        (id, left, top) => {
            setBoxes(
                update(boxes, {
                    [id]: {
                        $merge: { left, top }
                    }
                })
            );
        },
        [boxes, setBoxes]
    );
    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.BOX,
            drop(item, monitor) {
                const { x, y } = monitor.getDifferenceFromInitialOffset();
                const left = Math.round(item.left + x);
                const top = Math.round(item.top + y);
                moveBox(item.id, left, top);
                return undefined;
            }
        }),
        [moveBox]
    );

    let imgSrc = "MockMap.jpg"; //Should get from upload, this is mock data
    let image = new Image();
    image.src = imgSrc;

    let backgroundImage = "url(\"" + imgSrc + "\")";
    let imgWidth = image.width + "px";
    let imgHeight = image.height + "px";

    const backgroundImageStyle = {
        width: `${imgWidth}`,
        height: `${imgHeight}`,
        backgroundImage: `${backgroundImage}`
    };

    console.log(image)

    return (
        <div ref={drop} className={styles.map} id="map" style={backgroundImageStyle}>
            {Object.keys(boxes).map((key) => {
                const { left, top, title } = boxes[key];
                return (
                    <Bubble
                        key={key}
                        id={key}
                        left={left}
                        top={top}
                        hideSourceOnDrag={hideSourceOnDrag}
                    >
                        {title}
                    </Bubble>
                );
            })}
        </div>
    );
};

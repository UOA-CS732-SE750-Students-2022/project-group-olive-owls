import { useState, useCallback } from "react";
import {DroppableContainer} from "./DroppableContainer";

export const DragAndDrop = () => {
    const [hideSourceOnDrag, setHideSourceOnDrag] = useState(true);
    const toggle = useCallback(() => setHideSourceOnDrag(!hideSourceOnDrag), [
        hideSourceOnDrag
    ]);
    return (
        <div>
            <DroppableContainer hideSourceOnDrag={hideSourceOnDrag} />
        </div>
    );
};

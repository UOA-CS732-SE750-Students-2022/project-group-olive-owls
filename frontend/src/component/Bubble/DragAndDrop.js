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
            <p>
                <label htmlFor="hideSourceOnDrag">
                    <input
                        id="hideSourceOnDrag"
                        type="checkbox"
                        checked={hideSourceOnDrag}
                        onChange={toggle}
                    />
                    <small>Hide the source item while dragging</small>
                </label>
            </p>
        </div>
    );
};

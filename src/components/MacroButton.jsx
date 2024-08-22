import React, {useEffect} from "react";

/*

    props = {
        color: "#22d3ee",
        icon: "fas fa-microphone",
        keys: ["ctrl", "shift", "m"],
        command: "toggleMicrophone",
        position: {x: 100, y: 100}
    }

*/

function MacroButton(props) {

    const [isDragging, setIsDragging] = React.useState(false);
    const buttonRef = React.useRef(null);
    
    const handleMouseDown = async (event) => {
        if(props.isEditing) {
            setIsDragging(true);
        }
        else {
            console.log(props.command);
            const response = await fetch(props.command);

            console.log(response);
        }
    }

    const handleMouseMove = (event) => {
        if (isDragging) {

            const macroArea = props.macroAreaRef.current.getBoundingClientRect();

            // Calculate new position relative to macroArea
            let newX = event.clientX - buttonRef.current.clientWidth / 2;
            let newY = event.clientY - buttonRef.current.clientHeight / 2;

            // Constrain to macroArea boundaries
            if (newX < macroArea.left) newX = macroArea.left;
            if (newY < macroArea.top) newY = macroArea.top;

            if (newX > macroArea.right - buttonRef.current.clientWidth) {
                newX = macroArea.right - buttonRef.current.clientWidth;
            }
            if (newY > macroArea.bottom - buttonRef.current.clientHeight) {
                newY = macroArea.bottom - buttonRef.current.clientHeight;
            }

            console.log('NewX and NewY',newX, newY);
            console.log('macroArea Left and Top',macroArea.top, macroArea.left);

            // Update the position of the button
            props.updatePosition(props.index, newX, newY);
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <button ref={buttonRef}
        className="w-12 h-12 rounded-md"
        onMouseDown={handleMouseDown}
            style={{backgroundColor: props.color,
                    position: "absolute",
                    top: props.position.y,
                    left: props.position.x
            }}
        ></button>
    );
}

export default MacroButton;
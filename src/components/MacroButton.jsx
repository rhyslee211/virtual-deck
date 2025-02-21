import React, {useEffect} from "react";
import { TiDelete  } from "react-icons/ti";
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi";
import { colord } from "colord";
import { lighten, darken } from "polished";

/*

    props = {
        color: "#22d3ee",
        icon: "fas fa-microphone",
        keys: ["ctrl", "shift", "m"],
        command: "toggleMicrophone",
        position: {x: 100, y: 100}
    }

*/

function MacroButton({isEditing, color, icon, keys, command, position, index, updatePosition, deleteMacro, openEditMacroForm, macroAreaRef, checkConnection, toastErrorMessage, runMacroShortcutCommand}) {

    const [isDragging, setIsDragging] = React.useState(false);
    const buttonRef = React.useRef(null);
    
    const handleMouseDown = async (event) => {
        if(isEditing) {
            setIsDragging(true);
        }
        else {
            await runMacroShortcutCommand(command);
        }

    }

    const getHoverColor = (color) => {
        return colord(color).isDark() ? lighten(0.2, color) : darken(0.2, color);
    };

    const hoverColor = getHoverColor(color);

    const handleMouseMove = (event) => {
        if (isDragging) {

            const macroArea = macroAreaRef.current.getBoundingClientRect();

            // Calculate new position relative to macroArea
            let newX = event.clientX - buttonRef.current.clientWidth / 2 - macroArea.left;
            let newY = event.clientY - buttonRef.current.clientHeight / 2 - macroArea.top;

            // Constrain to macroArea boundaries
            if (newX < 0) newX = 0;
            if (newY < 0) newY = 0;

            if (newX > macroArea.width - buttonRef.current.clientWidth) {
                newX = macroArea.width - buttonRef.current.clientWidth;
            }
            if (newY > macroArea.height - buttonRef.current.clientHeight) {
                newY = macroArea.height - buttonRef.current.clientHeight;
            }

            //console.log('NewX and NewY',newX, newY);
            //console.log('macroArea Left and Top',macroArea.top, macroArea.left);

            // Update the position of the button
            updatePosition(index, newX, newY);
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
    };

    const handleDeleteButtonClick = () => {
        deleteMacro(index);
    }

    const handleEditButtonClick = () => {
        openEditMacroForm(index);
    }

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
        className={`w-12 h-12 rounded-md text-sm text-slate-900 flex items-center justify-center font-semibold ${colord(color).isDark() ? "text-white" : "text-black"}`}
        onMouseDown={handleMouseDown}
            style={{position: "absolute",
                    top: position.y,
                    left: position.x,
                    backgroundColor: color,
                    transition: "background-color 0.3s",
            }}
            onMouseEnter={() => buttonRef.current.style.backgroundColor = hoverColor}
            onMouseLeave={() => buttonRef.current.style.backgroundColor = color}
        >
            <div className="overflow-hidden text-ellipsis flex justify-center items-center line-clamp-2 h-full w-full">
                {icon}
            </div>
            
            {isEditing && <button onClick={handleEditButtonClick} className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-400 h-min w-min"><HiOutlineDotsCircleHorizontal  size={15} /></button>}
            {isEditing && <button onClick={handleDeleteButtonClick} className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400 h-min w-min"><TiDelete  size={15} /></button>}
        </button>
    );
}

export default MacroButton;
import React, {useRef} from "react";
import MacroButton from '../components/MacroButton';

function MacroArea({macros, isEditing, setMacros}) {

    const updatePosition = (key, newX, newY) => {
        // Update the position of the button
        
        setMacros(prevMacros => {
            const updatedMacros = [...prevMacros];
            updatedMacros[key].position = { x: newX, y: newY };
            return updatedMacros;
        });

    }

    const macroAreaRef = useRef(null);

    return (
        <div className="h-full w-full bg-slate-700" ref={macroAreaRef}>
            {macros.map((macro, index) => {
                return <MacroButton key={index} 
                    index={index}
                    color={macro.color} 
                    icon={macro.icon} 
                    keys={macro.keys} 
                    command={macro.command} 
                    position={macro.position}
                    isEditing={isEditing}
                    updatePosition={updatePosition}
                    macroAreaRef = {macroAreaRef}
                ></MacroButton>
            })}
        </div>
    );
}


export default MacroArea;

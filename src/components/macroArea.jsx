import React, {useRef} from "react";
import MacroButton from '../components/MacroButton';

function MacroArea({macros, isEditing, setMacros, deleteMacro, openEditMacroForm, checkConnection, toastErrorMessage, runMacroShortcutCommand}) {

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
        <div className="h-full w-full bg-slate-700 relative overflow-hidden scrollbar scrollbar-thumb-gray-500 hover:scrollbar-thumb-slate-500 scrollbar-track-gray-700" ref={macroAreaRef}>
            {macros.map((macro, index) => {
                return <MacroButton key={index} 
                    index={index}
                    color={macro.color} 
                    text={macro.text}
                    icon={macro.icon} 
                    keys={macro.keys} 
                    command={macro.command} 
                    position={macro.position}
                    isEditing={isEditing}
                    updatePosition={updatePosition}
                    macroAreaRef = {macroAreaRef}
                    deleteMacro={deleteMacro}
                    openEditMacroForm={openEditMacroForm}
                    checkConnection={checkConnection}
                    toastErrorMessage={toastErrorMessage}
                    runMacroShortcutCommand={runMacroShortcutCommand}
                ></MacroButton>
            })}
        </div>
    );
}


export default MacroArea;

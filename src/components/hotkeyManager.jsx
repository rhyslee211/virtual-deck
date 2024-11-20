import React from 'react';
import MacroButtonDisplay from './macroButtonDisplay';

function HotkeyManager({ macros }){

    

    return (
    <div className="w-full min-h-full bg-slate-700 flex justify-center bg-slate-700 pt-20 pb-6">
        <div className="w-full max-w-7xl flex flex-col flex-wrap justify-center items-center text-offwhite">
            <div className='w-3/4 flex items-center justify-between px-4'>
                <div>Hotkey</div>
                <div>Macro</div>
            </div>
            {macros.map((macro, index) => (
                <div className='w-3/4 rounded-md bg-slate-900 flex items-center justify-between my-6 px-4 h-16'>
                    <div className='bg-slate-800 p-2 w-3/4'>{macro.keys}</div>
                    <div>
                        <button>
                            Record New
                        </button>
                    </div>
                    <MacroButtonDisplay key={index} color={macro.color} icon={macro.icon}/>
                </div>
            ))}
        </div>
    </div>);

};


export default HotkeyManager;

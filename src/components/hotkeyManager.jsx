import { React, useEffect , useState , useCallback } from 'react';
import MacroButtonDisplay from './macroButtonDisplay';

function HotkeyManager({ macros, setMacros , registerShortcuts , unregisterShortcuts }) {

    const [macroIndex, setMacroIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [newKeys, setNewKeys] = useState('');
    const [numKeysPressed, setNumKeysPressed] = useState(0);

    const handleRecordNewButtonClick = (index) => {

        setNewKeys('');

        if(isRecording && macroIndex === index){

            setIsRecording(false);
        }
        else{

            setMacros(prevMacros => {
                const updatedMacros = [...prevMacros];
                updatedMacros[index].keys = '';
                return updatedMacros;
            });

            setIsRecording(true);
            setMacroIndex(index);
        }
    }

    const handleKeyUp = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();

        setNumKeysPressed((prevNumKeysPressed) => {
            const updatedNumKeysPressed = prevNumKeysPressed - 1;
            if (updatedNumKeysPressed === 0) {
                console.log('Recording stopped');
              setIsRecording(false);
            }
            return updatedNumKeysPressed;
          });
    }, []);

    const handleKeyDown = useCallback((event) => {
        event.preventDefault();
        event.stopPropagation();
        let key = event.key;

        if (key === " ") {
            key = "Space";
        }

        if (key === "Escape") {
            key = "Esc";
        }

        if (key === "Control") {
            key = "Ctrl";
        }

        if (event.code.startsWith('Numpad')) {
            key = 'num' + key;
        }

        if (event.code.startsWith('Key')) {
            key = key.toUpperCase();
        }

        setNewKeys(prevKeybind => {
            const updatedKeybind = prevKeybind === "" ? key : (!prevKeybind.includes(key) ? prevKeybind + '+' + key : prevKeybind);

            setMacros(prevMacros => {
                const updatedMacros = [...prevMacros];
                updatedMacros[macroIndex].keys = updatedKeybind;
                return updatedMacros;
            });

            return updatedKeybind;

        });

        setNumKeysPressed(prevNumKeysPressed => prevNumKeysPressed + 1);

    }, [newKeys, macroIndex, setNewKeys, setMacros]);


    useEffect(() => {
        if (isRecording) {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRecording, handleKeyDown, handleKeyUp]);

    useEffect(() => {
        if (isRecording) {
          unregisterShortcuts();
        } else {
          registerShortcuts();
        }
      }, [isRecording]);

    return (
    <div className="w-full min-h-full bg-slate-700 flex justify-center bg-slate-700 pt-20 pb-6">
        <div className="w-full max-w-7xl flex flex-col flex-wrap items-center text-offwhite">
            <div className='w-3/4 flex items-center justify-between px-4'>
                <div>Hotkey</div>
                <div>Macro</div>
            </div>
            {macros.map((macro, index) => (
                <div className='w-3/4 rounded-md bg-slate-900 flex items-center justify-between my-6 px-4 h-16'>
                    <div className='bg-slate-800 p-2 w-3/4'>{macro.keys !== '' && macro.keys}{macro.keys === '' && 'N/A'}</div>
                    <div>
                        <button onClick={() => handleRecordNewButtonClick(index)} className={`flex items-center justify-center mx-2 h-10 w-20 text-sm bg-slate-600 hover:bg-slate-700 ${isRecording && index == macroIndex ? 'border-2 border-amber-400' : ''}`}>
                            {isRecording && index == macroIndex && 'Recording...'}
                            {(!isRecording || index != macroIndex) && 'Record New'}
                        </button>
                    </div>
                    <MacroButtonDisplay key={index} color={macro.color} icon={macro.icon}/>
                </div>
            ))}
        </div>
    </div>);

};


export default HotkeyManager;

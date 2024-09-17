import { React, useState, useEffect , useCallback } from "react";

function AddMacroForm({closeForm, addMacro, toastErrorMessage}) {

    const [commandType, setCommandType] = useState("");
    const [commandText, setCommandText] = useState("");
    const [commandKeybind, setCommandKeybind] = useState("");
    const [microphoneName, setMicrophoneName] = useState("");
    const [sceneName, setSceneName] = useState("");
    const [buttonColor, setButtonColor] = useState("#22d3ee");
    const [isRecording, setIsRecording] = useState(false);

    const handleSelectChange = (e) => {
        setCommandType(e.target.value);
    }

    const getAllInputs = () => {
        let inputs = "";

        if (microphoneName !== "") {
            inputs += "?inputName=" + microphoneName;
        }
        if (sceneName !== "") {
            inputs += "?sceneName=" + sceneName;
        }

        return inputs;
    }

    const handleFormSubmit = () => {

        if (commandType === "") {
            toastErrorMessage("Please select a command type");
            return;
        }

        if (commandText === "") {
            toastErrorMessage("Please give this command a name");
            return;
        }

        addMacro({
            command: "http://localhost:3000/" + commandType + getAllInputs(), 
            color: buttonColor, 
            icon: commandText, 
            keys: commandKeybind, 
            position: {x: 100, y: 100}
        });
        closeForm();
    }

    const handleRecordClick = () => {
        if(!isRecording) {
            setCommandKeybind("");
        }
        setIsRecording(!isRecording);
    }

    const handleFormCancel = () => {
        console.log("Form Cancelled");
        closeForm();
    }

    const handleKeyDown = useCallback((event) => {
        event.preventDefault();
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

        setCommandKeybind(prevKeybind => {
            if (prevKeybind === "") {
                return key;
            } else {
                if (!prevKeybind.includes(key)) {
                    return prevKeybind + '+' + key;
                }
                return prevKeybind;
            }
        });
    }, []);

    useEffect(() => {
        if (isRecording) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRecording, handleKeyDown]);

    return (
        <div className="w-full h-full bg-slate-700 flex justify-center">
            <div className="h-full w-96 flex flex-col items-center justify-between">
                <div className="text-white mt-4 w-full">Command Type <br />
                    <select onChange={handleSelectChange} className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800">
                        <option value=""></option>
                        <optgroup label="OBS Studio">
                            <option value="start-stream">Start Stream</option>
                            <option value="stop-stream">Stop Stream</option>
                            <option value="start-recording">Start Recording</option>
                            <option value="stop-recording">Stop Recording</option>
                            <option value="switch-scene">Switch Scene</option>
                            <option value="mute-mic">Mute Mic</option>
                            <option value="unmute-mic">Unmute Mic</option>
                            <option value="toggle-mic">Toggle Mic</option>
                            <option value="toggle-webcam">Toggle Webcam</option>
                        </optgroup>
                        <optgroup label="Twitch">
                            <option value="run-twitch-ad">Run Twitch Ad</option>
                            <option value="raid-channel">Raid Channel</option>
                            <option value="host-channel">Host Channel</option>
                            <option value="marker">Create Marker</option>
                            <option value="clip">Create Clip</option>
                        </optgroup>
                        <optgroup label="System">
                            <option value="run-application">Run App</option>
                            <option value="open-url">Open URL</option>
                            <option value="run-script">Run Script</option>
                        </optgroup>
                    </select>
                    {commandType !== "" &&           
                    <div>
                        <div className="text-white">Command Text<br />
                            <input className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setCommandText(event.target.value)} type="text" />
                        </div>
                        <div className="text-white">Command Keybind<br />
                            <div className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800 flex flex-row justify-around items-center">
                                <input className="w-40 h-8 bg-slate-800" value={commandKeybind} type="text" readOnly />
                                <button className={`w-20 h-6 bg-slate-700 text-xs text-white ${isRecording ? 'border-2 border-red-600' : ''}`} onClick={handleRecordClick}>{!isRecording && "Record"}{isRecording && "Recording..."}</button>
                            </div>
                        </div>
                        {(commandType === "mute-mic" || commandType === "unmute-mic" || commandType === "toggle-mic") && <div className="text-white">Microphone Name<br />
                            <input className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setMicrophoneName(event.target.value)} type="text" />
                        </div>}
                        {commandType === "switch-scene" && <div className="text-white">Scene Name<br />
                            <input className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setSceneName(event.target.value)} type="text" />
                        </div>}
                        <div className="text-white">Background Color<br />
                            <div className="pt-6 flex flex-row justify-around">
                                <button onClick={(event)=>setButtonColor("#22d3ee")} 
                                className={`w-12 h-12 rounded-md bg-[#22d3ee] ${buttonColor === "#22d3ee" ? "border-2 border-white" : "" }`}
                                ></button>
                                <button onClick={(event)=>setButtonColor("#22ee9d")} 
                                className={`w-12 h-12 rounded-md bg-[#22ee9d] ${buttonColor === "#22ee9d" ? "border-2 border-white" : "" }`}
                                ></button>
                                <button onClick={(event)=>setButtonColor("#ee5e22")} 
                                className={`w-12 h-12 rounded-md bg-[#ee5e22] ${buttonColor === "#ee5e22" ? "border-2 border-white" : "" }`}
                                ></button>
                                <button onClick={(event)=>setButtonColor("#eede22")} 
                                className={`w-12 h-12 rounded-md bg-[#eede22] ${buttonColor === "#eede22" ? "border-2 border-white" : "" }`}
                                ></button>
                                <button onClick={(event)=>setButtonColor("#d322ee")} 
                                className={`w-12 h-12 rounded-md bg-[#d322ee] ${buttonColor === "#d322ee" ? "border-2 border-white" : "" }`}
                                ></button>
                            </div>
                        </div>
                    </div>}
                </div>
                <div className="flex flex-row text-white justify-between w-full">
                    <button onClick={handleFormSubmit} className="w-36 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Save</button>
                    <button onClick={handleFormCancel} className="w-36 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddMacroForm;

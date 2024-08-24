import { React, useState } from "react";

function AddMacroForm({closeForm, addMacro}) {

    const [commandType, setCommandType] = useState("");
    const [commandText, setCommandText] = useState("");
    const [commandKeybind, setCommandKeybind] = useState("");
    const [microphoneName, setMicrophoneName] = useState("");
    const [sceneName, setSceneName] = useState("");
    const [buttonColor, setButtonColor] = useState("#22d3ee");

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

    const handleFormCancel = () => {
        console.log("Form Cancelled");
        closeForm();
    }

    return (
        <div className="w-full h-full bg-slate-700 flex justify-center">
            <div className="h-full w-1/2 flex flex-col items-center justify-between">
                <div className="text-white mt-4 w-full">Command Type <br />
                    <select onChange={handleSelectChange} className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800">
                        <option value=""></option>
                        <option value="start-stream">Start Stream</option>
                        <option value="stop-stream">Stop Stream</option>
                        <option value="start-recording">Start Recording</option>
                        <option value="stop-recording">Stop Recording</option>
                        <option value="mute-mic">Mute Mic</option>
                        <option value="unmute-mic">Unmute Mic</option>
                    </select>
                    {commandType !== "" &&           
                    <div>
                        <div className="text-white">Command Text<br />
                            <input className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setCommandText(event.target.value)} type="text" />
                        </div>
                        <div className="text-white">Command Keybind<br />
                            <input className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setCommandKeybind(event.target.value)} type="text" />
                        </div>
                        {(commandType === "mute-mic" || commandType === "unmute-mic") && <div className="text-white">Microphone Name<br />
                            <input className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setMicrophoneName(event.target.value)} type="text" />
                        </div>}
                        {commandType === "switch-scene" && <div className="text-white">Scene Name<br />
                            <input className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setSceneName(event.target.value)} type="text" />
                        </div>}
                        <div className="text-white">Button Color<br />
                            <div className="flex flex-row justify-around">
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
                <div className="flex flex-row text-white justify-around w-full lg:w-2/3">
                    <button onClick={handleFormSubmit} className="w-48 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Save</button>
                    <button onClick={handleFormCancel} className="w-48 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddMacroForm;

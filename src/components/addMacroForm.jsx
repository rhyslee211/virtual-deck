import { React, useState, useEffect , useCallback , useRef } from "react";
import MacroButtonDisplay from "./macroButtonDisplay";

function AddMacroForm({closeForm, addMacro, toastErrorMessage, editMode = false, macroToEdit}) {

    const [commandType, setCommandType] = useState("");
    const [commandText, setCommandText] = useState("");
    const [commandKeybind, setCommandKeybind] = useState("");
    const [microphoneName, setMicrophoneName] = useState("");
    const [sceneName, setSceneName] = useState("");
    const [buttonColor, setButtonColor] = useState("#22d3ee");
    const [isRecording, setIsRecording] = useState(false);
    const [applicationName, setApplicationName] = useState("");
    const [url, setUrl] = useState("");
    const [script, setScript] = useState("");
    const [cameraName, setCameraName] = useState("");
    const [channelName, setChannelName] = useState("");
    const [duration, setDuration] = useState(0); 
    const fileInputRef = useRef(null);


    const handleSelectChange = (e) => {
        setCommandType(e.target.value);

        resetInputs();
    }

    const openFileBrowser = () => {
        if (fileInputRef.current) {
          fileInputRef.current.click(); // Trigger the file input's click event
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get selected files
        if(file){
            console.log(file);
            setApplicationName(file.path);
        }
        else {
            console.log("No file selected");
        }
      };

    const resetInputs = () => {
        setMicrophoneName("");
        setSceneName("");
        setApplicationName("");
        setUrl("");
        setScript("");
        setCameraName("");
        setChannelName("");
        setDuration(0);
    }

    const getAllInputs = () => {
        let inputs = "";

        if (microphoneName !== "") {
            inputs += "?inputName=" + microphoneName;
        }
        if (sceneName !== "") {
            inputs += "?sceneName=" + sceneName;
        }
        if (applicationName !== "") {
            inputs += "?applicationName=" + applicationName;
        }
        if (url !== "") {
            inputs += "?url=" + url;
        }
        if (script !== "") {
            inputs += "?script=" + script;
        }
        if (cameraName !== "") {
            inputs += "?cameraName=" + cameraName;
        }
        if (channelName !== "") {
            inputs += "?channelName=" + channelName;
        }
        if (duration !== 0) {
            inputs += "?duration=" + duration;
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

        if (editMode) {
            macroToEdit.command = "http://localhost:3000/" + commandType + getAllInputs();
            macroToEdit.color = buttonColor;
            macroToEdit.icon = commandText;
            macroToEdit.keys = commandKeybind;
        }
        else {
            addMacro({
                command: "http://localhost:3000/" + commandType + getAllInputs(), 
                color: buttonColor, 
                icon: commandText, 
                keys: commandKeybind, 
                position: {x: 100, y: 100}
            });
        }
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
        if (editMode) {
            console.log(macroToEdit);
            setCommandType(macroToEdit.command.split("http://localhost:3000/")[1].split("?")[0]);
            console.log(macroToEdit.command.split("http://localhost:3000/")[1].split("?")[0])
            setCommandText(macroToEdit.icon);
            setCommandKeybind(macroToEdit.keys);
            setButtonColor(macroToEdit.color);


            if (macroToEdit.command.includes("inputName")) {
                setMicrophoneName(macroToEdit.command.split("inputName=")[1]);
            }
            if (macroToEdit.command.includes("sceneName")) {
                setSceneName(macroToEdit.command.split("sceneName=")[1]);
            }
            if (macroToEdit.command.includes("applicationName")) {
                setApplicationName(macroToEdit.command.split("applicationName=")[1]);
            }
            if (macroToEdit.command.includes("url")) {
                setUrl(macroToEdit.command.split("url=")[1]);
            }
            if (macroToEdit.command.includes("script")) {
                setScript(macroToEdit.command.split("script=")[1]);
            }
            if (macroToEdit.command.includes("cameraName")) {
                setCameraName(macroToEdit.command.split("cameraName=")[1]);
            }
            if (macroToEdit.command.includes("channelName")) {
                setChannelName(macroToEdit.command.split("channelName=")[1]);
            }
            if (macroToEdit.command.includes("duration")) {
                setDuration(Number(macroToEdit.command.split("duration=")[1]));
            }
        }
    }, [editMode]);

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
        <div className="w-full min-h-full bg-slate-700 flex justify-center bg-slate-700">
            <div className="h-full w-96 flex flex-col items-center justify-between">
                <div className="text-white mt-4 w-full">Command Type <br />
                    <select value={commandType} onChange={handleSelectChange} className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800 scrollbar scrollbar-thumb-gray-500 hover:scrollbar-thumb-slate-500 scrollbar-track-gray-700">
                        <option></option>
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
                            <option value="run-stream-ad">Run Ad</option>
                            <option value="raid-channel">Raid Channel</option>
                            <option value="create-stream-marker">Create Marker</option>
                            <option value="create-stream-clip">Create Clip</option>
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
                            <input value={commandText} className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setCommandText(event.target.value)} type="text" />
                        </div>
                        <div className="text-white">Command Keybind<br />
                            <div className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800 flex flex-row justify-around items-center">
                                <input className="w-40 h-8 bg-slate-800" value={commandKeybind} type="text" readOnly />
                                <button className={`w-20 h-6 bg-slate-700 text-xs text-white ${isRecording ? 'border-2 border-amber-400' : ''}`} onClick={handleRecordClick}>{!isRecording && "Record"}{isRecording && "Recording..."}</button>
                            </div>
                        </div>
                        {(commandType === "mute-mic" || commandType === "unmute-mic" || commandType === "toggle-mic") && <div className="text-white">Microphone Name<br />
                            <input value={microphoneName} className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setMicrophoneName(event.target.value)} type="text" />
                        </div>}
                        {commandType === "switch-scene" && <div className="text-white">Scene Name<br />
                            <input value={sceneName} className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setSceneName(event.target.value)} type="text" />
                        </div>}
                        {commandType === "toggle-webcam" && <div className="text-white">Webcam Name<br />
                            <input value={cameraName} className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setCameraName(event.target.value)} type="text" />
                        </div>}
                        {commandType === "raid-channel" || commandType === "host-channel" && <div className="text-white">Channel Name<br />
                            <input value={microphoneName} className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setMicrophoneName(event.target.value)} type="text" />
                        </div>}
                        {commandType === "run-application" && <div className="text-white">Application Name<br />
                            <div className="flex flex-row w-64 justify-between h-8 mt-4 mb-4">
                                <input readOnly value={applicationName ? applicationName.split("\\").pop() : ""} className="w-44 h-8 rounded-md bg-slate-800" type="text" />
                                <button onClick={openFileBrowser} className="w-16 h-8 rounded-md bg-slate-800 text-xs">Browse...</button>
                            </div>
                        </div>}
                        {commandType === "open-url" && <div className="text-white">URL<br />
                            <input value={url} className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setUrl(event.target.value)} type="text" />
                        </div>}
                        {commandType === "run-script" && <div className="text-white">Script<br />
                            <input value={script} className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setScript(event.target.value)} type="text" />
                        </div>}
                        {commandType === "raid-channel" || commandType === "host-channel" && <div className="text-white">Channel Name<br />
                            <input value={channelName} className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setChannelName(event.target.value)} type="text" />
                        </div>}
                        {commandType === "run-stream-ad" && <div className="text-white">Ad Length<br />
                            <select value={duration} className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event) => setDuration(Number(event.target.value))}>
                                <option value="30">30 Seconds</option>
                                <option value="60">60 Seconds</option>
                                <option value="90">90 Seconds</option>
                                <option value="120">120 Seconds</option>
                                <option value="150">150 Seconds</option>
                                <option value="180">180 Seconds</option>
                            </select>
                        </div>}
                        {/*commandType === "create-stream-clip" && <div className="text-white">Clip Length<br />
                            <select className="w-64 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event) => setDuration(Number(event.target.value))}>
                                <option value="15">15 Seconds</option>
                                <option value="30">30 Seconds</option>
                                <option value="45">45 Seconds</option>
                                <option value="60">60 Seconds</option>
                            </select>
                        </div>*/}
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
                <div className="flex flex-col items-center justify-center mt-4">
                    <div className="text-white mb-2">Button Preview</div>
                    <MacroButtonDisplay color={buttonColor} icon={commandText} />
                </div>
                <div className="flex flex-row text-white justify-between w-full">
                    <button onClick={handleFormSubmit} className="w-36 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Save</button>
                    <button onClick={handleFormCancel} className="w-36 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Cancel</button>
                </div>
            </div>
            <input
                ref={fileInputRef}
                type="file"
                multiple={false} // Allow only a single file to be selected
                className="hidden" // Hide the input
                onChange={handleFileChange}
            />
        </div>
    );
}

export default AddMacroForm;

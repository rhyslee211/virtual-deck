import { React, useState } from "react";


function AddMacroForm({closeForm, addMacro}) {

    const [commandType, setCommandType] = useState("");

    const handleSelectChange = (e) => {
        setCommandType(e.target.value);
    }

    const handleFormSubmit = () => {
        addMacro({
            command: "http://localhost:3000/" + commandType, 
            color: "#22d3ee", 
            icon: "fas fa-microphone", 
            keys: ["ctrl", "shift", "m"], 
            position: {x: 100, y: 100}
        });
        closeForm();
    }

    const handleFormCancel = () => {
        console.log("Form Cancelled");
        closeForm();
    }

    return (
        <div className="w-full h-full bg-slate-700">
            <div className="flex flex-col items-center">
                <div className="text-white">Command Type <br />
                    <select onChange={handleSelectChange} className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800">
                        <option value=""></option>
                        <option value="start-stream">Start Stream</option>
                        <option value="stop-stream">Stop Stream</option>
                        <option value="start-recording">Start Recording</option>
                        <option value="stop-recording">Stop Recording</option>
                        <option value="mute-mic">Mute Mic</option>
                        <option value="unmute-mic">Unmute Mic</option>
                    </select>
                </div>
                {commandType !== "" && <div className="text-white">{commandType}</div>}
                <div className="flex flex-row text-white justify-around w-2/3 lg:w-1/2">
                    <button onClick={handleFormSubmit} className="w-48 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Save</button>
                    <button onClick={handleFormCancel} className="w-48 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default AddMacroForm;

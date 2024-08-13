import React from "react";

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
    

    return (
        <button className="w-12 h-12 mt-4 mb-4 rounded-md"
            style={{backgroundColor: props.color}}
        ></button>
    );
}

export default MacroButton;
import React from "react";
import { ipcRenderer } from "electron";


function WindowsControls() {

    const [isMaximized, setIsMaximized] = React.useState(false);

    function controlWindow(action) {
        ipcRenderer.send(action);

        if (action === 'maximize') {
            toggleMaxRestoreButtons(true);
        } 
        else if (action === 'resize') {
            toggleMaxRestoreButtons(false);
        }
    }

    function toggleMaxRestoreButtons(isMaximized) {
        if (isMaximized) {
            setIsMaximized(true);
        } else {
            setIsMaximized(false);
        }
    }

    return (
        <div className="top-0 left-0 w-full bg-slate-900 flex flex-row justify-between">
            <div className="text-white">Virtual Deck</div>
            <div className="flex justify-end items-center w-max">
                <button className="text-white px-4 py-2 rounded-lg w-fit h-fit hover:bg-red-600" onClick={() => controlWindow('minimize')}>
                    <img alt="Minimize button" srcSet="assets/min-w-10.png 1x, assets/min-w-12.png 1.25x, assets/min-w-15.png 1.5x, assets/min-w-15.png 1.75x, assets/min-w-20.png 2x, assets/min-w-20.png 2.25x, assets/min-w-24.png 2.5x, assets/min-w-30.png 3x, assets/min-w-30.png 3.5x" draggable="false" />
                </button>
                {!isMaximized && <button className="text-white px-4 py-2 rounded-lg w-fit h-fit hover:bg-red-600" onClick={() => controlWindow('maximize')}>
                    <img alt="Maximize button" srcSet="assets/max-w-10.png 1x, assets/max-w-12.png 1.25x, assets/max-w-15.png 1.5x, assets/max-w-15.png 1.75x, assets/max-w-20.png 2x, assets/max-w-20.png 2.25x, assets/max-w-24.png 2.5x, assets/max-w-30.png 3x, assets/max-w-30.png 3.5x" draggable="false" />
                </button>}
                {isMaximized && <button className="text-white px-4 py-2 rounded-lg w-fit h-fit hover:bg-red-600" onClick={() => controlWindow('resize')}>
                    <img alt="restore button" srcSet="assets/restore-w-10.png 1x, assets/restore-w-12.png 1.25x, assets/restore-w-15.png 1.5x, assets/restore-w-15.png 1.75x, assets/restore-w-20.png 2x, assets/restore-w-20.png 2.25x, assets/restore-w-24.png 2.5x, assets/restore-w-30.png 3x, assets/restore-w-30.png 3.5x" draggable="false" />
                </button>}
                <button className="text-white px-4 py-2 rounded-lg w-fit h-fit hover:bg-red-600" onClick={() => controlWindow('close')}>
                    <img alt="close button" srcSet="assets/close-w-10.png 1x, assets/close-w-12.png 1.25x, assets/close-w-15.png 1.5x, assets/close-w-15.png 1.75x, assets/close-w-20.png 2x, assets/close-w-20.png 2.25x, assets/close-w-24.png 2.5x, assets/close-w-30.png 3x, assets/close-w-30.png 3.5x" draggable="false" />
                </button>
            </div>
        </div>
    );
}

export default WindowsControls;
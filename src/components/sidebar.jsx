import React from "react";

function Sidebar({onFormButtonClick, onEditButtonClick}) {
    return (
        <div className="w-16 bg-slate-800">
            <div className="flex flex-col items-center">
                <button className="w-12 h-12 mt-4 mb-4 bg-indigo-400 rounded-full" onClick={onFormButtonClick}></button>
                <button className="w-12 h-12 mb-4 bg-indigo-400 rounded-full" onClick={onEditButtonClick}></button>
                <button className="w-12 h-12 mb-4 bg-indigo-400 rounded-full"></button>
                <button className="w-12 h-12 mb-4 bg-indigo-400 rounded-full"></button>
                <button className="w-12 h-12 mb-4 bg-indigo-400 rounded-full"></button>
            </div>
        </div>
    );
}

export default Sidebar;
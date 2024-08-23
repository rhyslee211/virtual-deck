import React from "react";
import { FaPlus, FaPencilAlt  } from "react-icons/fa";

function Sidebar({onFormButtonClick, onEditButtonClick}) {
    return (
        <div className="w-16 bg-slate-800">
            <div className="flex flex-col items-center">
                <button className="w-12 h-12 mt-4 mb-4 bg-indigo-400 rounded-full flex items-center justify-center" onClick={onFormButtonClick}><FaPlus size={24} /></button>
                <button className="w-12 h-12 mb-4 bg-indigo-400 rounded-full flex items-center justify-center" onClick={onEditButtonClick}><FaPencilAlt size={24} /></button>
                <button className="w-12 h-12 mb-4 bg-indigo-400 rounded-full flex items-center justify-center"></button>
                <button className="w-12 h-12 mb-4 bg-indigo-400 rounded-full flex items-center justify-center"></button>
                <button className="w-12 h-12 mb-4 bg-indigo-400 rounded-full flex items-center justify-center"></button>
            </div>
        </div>
    );
}

export default Sidebar;
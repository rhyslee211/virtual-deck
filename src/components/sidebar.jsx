import React from "react";
import { FaPlus, FaPencilAlt  } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { SiObsstudio } from "react-icons/si";
import { FaTwitch } from 'react-icons/fa';

function Sidebar({onFormButtonClick, onEditButtonClick, isEditing, formState, onSettingsButtonClick, connectToOBS, obsConnected, connectToTwitch, isTwitchConnected}) {
    return (
        <div className="w-16 bg-slate-800 h-full">
            <div className="flex flex-col items-center justify-between h-full">
                <div className="flex flex-col items-center">
                    <button className={`w-12 h-12 mt-4 mb-4 bg-indigo-400 rounded-full flex items-center justify-center hover:bg-indigo-500 ${formState === "addMacroForm" ? 'border-2 border-white' : ''}`} onClick={onFormButtonClick}><FaPlus size={24} /></button>
                    <button className={`w-12 h-12 mb-4 bg-indigo-400 rounded-full flex items-center justify-center hover:bg-indigo-500 ${isEditing ? 'border-2 border-white' : ''}`} onClick={onEditButtonClick}><FaPencilAlt size={24} /></button>
                    <button className={`w-12 h-12 mb-4 bg-indigo-400 rounded-full flex items-center justify-center hover:bg-indigo-500 ${formState === "settingsForm" ? 'border-2 border-white' : ''}`} onClick={onSettingsButtonClick}><IoMdSettings size={24} /></button>
                </div>
                <div className="flex flex-col items-center">
                    <button className={`w-12 h-12 mb-4 bg-indigo-400 rounded-full flex items-center justify-center hover:bg-indigo-500 ${isTwitchConnected ? 'border-4 border-green-500 outline outline-1 outline-black' : 'border-4 border-orange-400 outline outline-1 outline-black'}`} onClick={connectToTwitch}><FaTwitch size={24} /></button>
                    <button className={`w-12 h-12 mb-4 bg-indigo-400 rounded-full flex items-center justify-center hover:bg-indigo-500 ${obsConnected ? 'border-4 border-green-500 outline outline-1 outline-black' : 'border-4 border-orange-400 outline outline-1 outline-black'}`} onClick={connectToOBS}><SiObsstudio size={24} /></button>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
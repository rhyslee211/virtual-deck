import React, { useEffect, useState } from 'react';
import { FaTwitch } from 'react-icons/fa';


function SettingsForm({closeForm, setObsPort, setObsPassword, saveSettings , obsPort, obsPassword,twitchUsername,setTwitchUsername,isTwitchConnected,connectToTwitch,isRevokingTwitchToken,setIsRevokingTwitchToken, disconnectFromTwitch, verifyTwitchConnection}) {

    const [tempObsPort, setTempObsPort] = React.useState('');
    const [tempObsPassword, setTempObsPassword] = React.useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    const handleFormSubmit = () => {
        setObsPort(tempObsPort);
        setObsPassword(tempObsPassword);
        console.log(tempObsPort, tempObsPassword);
        //saveSettings();
        //closeForm();
        setIsFormSubmitted(true);
    }

    const handleFormCancel = () => {
        closeForm();
    }

    const handleTwitchConnectButtonClick = async () => {

        connectToTwitch();

    }

    const handleTwitchDisconnectButtonClick = async () => {

        disconnectFromTwitch();

    }

    useEffect(() => {
        setTempObsPort(obsPort);
        setTempObsPassword(obsPassword);
    }, [obsPort, obsPassword]);

    useEffect(() => {
        if (isFormSubmitted) {
            saveSettings();
            closeForm();
        }
    }, [isFormSubmitted, tempObsPort, tempObsPassword, saveSettings, closeForm]);

    useEffect(() => {
        verifyTwitchConnection();
    }, [isTwitchConnected]);

    return (
        <div className='w-full h-full bg-slate-700 flex justify-center pt-6 relative'>
            <div className='w-96 h-full items-center bg-slate-700 flex flex-col justify-around'>
                <div className='flex flex-col justify-around'>
                    <div className="text-white">OBS Websocket Port<br />
                        <input className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800 px-2" onChange={(event)=> setTempObsPort(event.target.value)} type="text" value={tempObsPort} />
                    </div>
                    <div className="text-white">OBS Websocket Password<br />
                        <input type="password" className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800 px-2" onChange={(event)=> setTempObsPassword(event.target.value)} value={tempObsPassword} />
                    </div>
                    <button className="flex flex-row justify-around w-48 h-12 mt-4 mb-4 px-2 rounded-md bg-slate-800 border border-white text-white items-center justify-center align-middle custom-twitch-style" onClick={handleTwitchConnectButtonClick}>
                        <FaTwitch size={32} />
                        <div className='overflow-hidden text-ellipsis whitespace-nowrap flex-1'>
                            {!isTwitchConnected && 'Connect to Twitch'} {isTwitchConnected && twitchUsername}
                        </div>
                    </button>
                    <a href="https://www.buymeacoffee.com/rhyslee211" target="_blank"  className='w-48 h-15 mt-4 mb-4'>
                        <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" className='w-48 h-15'/>
                    </a>
                </div>

                <div className="flex flex-row text-white justify-between w-full">
                    <button onClick={handleFormSubmit} className="w-36 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Save</button>
                    <button onClick={handleFormCancel} className="w-36 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Cancel</button>
                </div>
            </div>

            {isRevokingTwitchToken && <div className='w-full h-full bg-black bg-opacity-50 absolute top-0 left-0 flex justify-center items-center'>
                <div className='w-96 h-48 bg-slate-600 flex flex-col justify-around rounded-lg border-white border-2'>
                    <div className='flex flex-col justify-around'>
                        <div className="text-white text-center">Disconnect from Twitch?</div>
                        <div className="flex flex-row text-white justify-around w-96">
                            <button onClick={handleTwitchDisconnectButtonClick} className="w-36 h-12 mt-4 mb-4 rounded-md bg-red-500 text-slate-800 border border-white hover:bg-red-400">Yes</button>
                            <button onClick={()=>setIsRevokingTwitchToken(false)} className="w-36 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">No</button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default SettingsForm;
import React, { useEffect, useState } from 'react';
import { FaTwitch } from 'react-icons/fa';


function SettingsForm({closeForm, setObsPort, setObsPassword, saveSettings , obsPort, obsPassword,twitchUsername,setTwitchUsername,isTwitchConnected,setIsTwitchConnected}) {

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

        console.log('Origin: ',window.location.origin);

        const popup = window.open(
            'http://localhost:3000/auth/twitch/authToken/getAccessToken',
            'TwitchAuthPopup', // Name of the popup window
            'width=500,height=700,resizable,scrollbars=yes,status=yes'
        );

        const handleMessage = (event) => {
            console.log('Received message:', event);
            if (event.origin !== 'http://localhost:3000') {
                return;
            }
            console.log('event.data', event.data);
            if (event.data.twitchConnected) {
                setIsTwitchConnected(true);
                setTwitchUsername(event.data.twitchUsername);
                popup.close();
                window.removeEventListener('message', handleMessage);
            }
        };

        window.addEventListener('message', handleMessage);

    }

    const verifyTwitchConnection = async () => {
        if (isTwitchConnected) {
            const response = await fetch('http://localhost:3000/auth/twitch/validateToken')

            if (response.status === 200) {
                console.log('Twitch token is valid');
            }
            else {
                console.log('Twitch token is invalid');
                setIsTwitchConnected(false);
            }
        }
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
        <div className='w-full h-full bg-slate-700 flex justify-center pt-6'>
            <div className='w-96 h-full items-center bg-slate-700 flex flex-col justify-around'>
                <div className='flex flex-col justify-around'>
                    <div className="text-white">OBS Websocket Port<br />
                        <input className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setTempObsPort(event.target.value)} type="text" value={tempObsPort} />
                    </div>
                    <div className="text-white">OBS Websocket Password<br />
                        <input type="password" className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setTempObsPassword(event.target.value)} value={tempObsPassword} />
                    </div>
                    <button className="flex flex-row justify-around w-48 h-12 mt-4 mb-4 px-2 rounded-md bg-slate-800 border border-white text-white items-center justify-center align-middle custom-twitch-style" onClick={handleTwitchConnectButtonClick}>
                        <FaTwitch size={32} />
                        <div className='overflow-hidden text-ellipsis whitespace-nowrap flex-1'>
                            {!isTwitchConnected && 'Connect to Twitch'} {isTwitchConnected && twitchUsername}
                        </div>
                    </button>
                </div>

                <div className="flex flex-row text-white justify-between w-full">
                    <button onClick={handleFormSubmit} className="w-36 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Save</button>
                    <button onClick={handleFormCancel} className="w-36 h-12 mt-4 mb-4 rounded-md bg-slate-800 border border-white hover:bg-slate-700">Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default SettingsForm;
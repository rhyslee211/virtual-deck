import React, { useEffect } from 'react';

function SettingsForm({closeForm, setObsPort, setObsPassword, setTwitchApiKey, obsPort, obsPassword, twitchApiKey}) {

    const [tempObsPort, setTempObsPort] = React.useState('');
    const [tempObsPassword, setTempObsPassword] = React.useState('');
    const [tempTwitchApiKey, setTempTwitchApiKey] = React.useState('');

    const handleFormSubmit = () => {
        setObsPort(tempObsPort);
        setObsPassword(tempObsPassword);
        setTwitchApiKey(tempTwitchApiKey);
        console.log(tempObsPort, tempObsPassword, tempTwitchApiKey);
        closeForm();
    }

    const handleFormCancel = () => {
        closeForm();
    }

    useEffect(() => {
        setTempObsPort(obsPort);
        setTempObsPassword(obsPassword);
        setTempTwitchApiKey(twitchApiKey);
    }, [obsPort, obsPassword, twitchApiKey]);

    return (
        <div className='w-full h-full bg-slate-700 flex justify-center pt-6'>
            <div className='w-96 h-full items-center bg-slate-700 flex flex-col justify-around'>
                <div className='flex flex-col justify-around'>
                    <div className="text-white">OBS Websocket Port<br />
                        <input className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setTempObsPort(event.target.value)} type="text" value={tempObsPort} />
                    </div>
                    <div className="text-white">OBS Websocket Password<br />
                        <input className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setTempObsPassword(event.target.value)} type="text" value={tempObsPassword} />
                    </div>
                    <div className="text-white">Twitch API Key<br />
                        <input className="w-48 h-8 mt-4 mb-4 rounded-md bg-slate-800" onChange={(event)=> setTempTwitchApiKey(event.target.value)} type="text" value={tempTwitchApiKey} />
                    </div>
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
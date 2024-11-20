import { React, useEffect, useState} from 'react';
import Sidebar from './components/Sidebar';
import WindowsControls from './components/WindowsControls';
import MacroArea from './components/macroArea';
import AddMacroForm from './components/addMacroForm';
import { Toaster, toast } from 'react-hot-toast';
import { ipcRenderer } from "electron";
import SettingsForm from './components/settingsForm';
import HotkeyManager from './components/hotkeyManager';

function App() {

  const [formState, setFormState] = useState("macroArea");
  //const [isFormVisible, setIsFormVisible] = useState(false);
  const [macros, setMacros] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [obsConnected, setObsConnected] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const [obsPort, setObsPort] = useState("");
  const [obsPassword, setObsPassword] = useState("");
  const [isTwitchConnected, setIsTwitchConnected] = useState(false);
  const [twitchUsername, setTwitchUsername] = useState('');
  const [isRevokingTwitchToken, setIsRevokingTwitchToken] = useState(false);
  const [macroIndex, setMacroIndex] = useState(0);

  const checkConnection = async () => {
    const response = await fetch('http://localhost:3000/check-connection');
    if(response.status === 200) {
      setObsConnected(true);
      if(firstRun){
        toastSuccessMessage('Connected to OBS');
        setFirstRun(false);
      }
    }
    else {
      setObsConnected(false);
      toastErrorMessage('No OBS connection');
    }
  }

  const connectToTwitch = async () => {
    if(!isTwitchConnected){
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
    else{
        /*const response = await fetch('http://localhost:3000/auth/twitch/revokeToken');
        if(response.status === 200){
            setIsTwitchConnected(false);
        }*/

        setFormState("settingsForm");
        setIsRevokingTwitchToken(true);
    }
  }

  const disconnectFromTwitch = async () => {
    const response = await fetch('http://localhost:3000/auth/twitch/revokeToken');

    if(response.status === 200){
        setIsTwitchConnected(false);
        setTwitchUsername('');
    }
    setIsRevokingTwitchToken(false);
  }

  const verifyTwitchConnection = async () => {

    const response = await fetch('http://localhost:3000/auth/twitch/validateToken')

    if (response.status === 200) {
        console.log('Twitch token is valid');

        const UsernameResponse = await fetch('http://localhost:3000/auth/twitch/getUser');
        const username = await UsernameResponse.json();
        setIsTwitchConnected(true);
        setTwitchUsername(username.Username);
    }
    else {
        console.log('Twitch token is invalid');
        setIsTwitchConnected(false);
    }
  } 

  const runMacroShortcutCommand = async (command) => {
    const response = await fetch(command);

    console.log(response);

    checkConnection();
  }

  const registerShortcuts = async () => {
    try {
      // Call the 'register-shortcuts' in main.js and pass the macros dictionary
      await ipcRenderer.invoke('register-shortcuts', macros);
      console.log('Shortcuts registered successfully!');
    } catch (error) {
      console.error('Failed to register shortcuts:', error);
    }
  };

  async function saveMacros() {
    try {
      const response = await ipcRenderer.invoke('save-macros', macros);

      registerShortcuts();
      //console.log(response);
    } catch (error) {
      console.error('Failed to save macros:', error);
    }
  }
  
  async function loadMacros() {
    try {
      const macros = await ipcRenderer.invoke('load-macros');
      registerShortcuts();
      //console.log(macros);
      setMacros(macros);
    } catch (error) {
      console.error('Failed to load macros:', error);
    }
  }

  async function saveSettings() {
    try {
      const response = await ipcRenderer.invoke('save-settings', {obsPort, obsPassword});
      //console.log(response);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  async function loadSettings() {
    try {
      const settings = await ipcRenderer.invoke('load-settings');
      setObsPort(settings.obsPort);
      setObsPassword(settings.obsPassword);
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  const connectToOBS = async () => {
    const response = await fetch(`http://localhost:3000/connect-to-obs?port=${obsPort}&password=${obsPassword}`,
      {
        method: 'GET'
      }

    );
    if(response.status === 200) {
      setObsConnected(true);
      toastSuccessMessage('Connected to OBS');
    }
    else {
      setObsConnected(false);
      toastErrorMessage('Failed to connect to OBS');
    }
  }

  const openForm = () => {
    if(formState !== "addMacroForm") {
      setIsEditing(false);
      //setIsFormVisible(true);
      setFormState("addMacroForm");
    }
    else {
      //setIsFormVisible(false);
      setFormState("macroArea");
    }
  }

  const openEditMacroForm = (index) => {
    if(formState !== "editMacroForm") {
      setIsEditing(true);
      //setIsFormVisible(true);
      setFormState("editMacroForm");
      setMacroIndex(index);
    }
  }

  const closeForm = () => {
    if(formState !== "macroArea") {
      //setIsFormVisible(false);
      setFormState("macroArea");
    }
  }

  const addMacro = (newMacro) => {
    setMacros([...macros, newMacro]); // Add new macro to the list
    saveMacros(macros);
    console.log(macros);
  }

  const deleteMacro = (index) => {
    setMacros(macros.filter((_, i) => i !== index)); // Remove macro from the list
  }

  const toggleEditor = () => {
    if(formState === "macroArea") {
      setIsEditing(!isEditing);
    }
    saveMacros(macros);
  }

  const onSettingsButtonClick = () => {
    if(formState !== "settingsForm") {
      setFormState("settingsForm");
    }
    else {
      setFormState("macroArea");
    }
  }

  const onHotkeyFormButtonClick = () => {
    if(formState !== "hotkeyForm") {
      setFormState("hotkeyForm");
    }
    else {
      setFormState("macroArea");
    }
  }

  useEffect(() => {
    if (!hasRun) {
      //checkConnection();
      // toast.success('This is a success message!');
      loadMacros();
      loadSettings();
      setHasRun(true);
      setTimeout(verifyTwitchConnection(),3000);
    }
  }, [hasRun]);

  useEffect(() => {
    if (obsPort !== "" && obsPassword !== "") {
      connectToOBS();
    }
  }, [obsPort, obsPassword]);

  const toastErrorMessage = (message) => {
    toast.error(message);
  }

  const toastSuccessMessage = (message) => {
    toast.success(message);
  }

  useEffect(() => {
    // Listen for the IPC message from main process with a parameter
    ipcRenderer.on('shortcut-pressed', (event, parameter) => {
      runMacroShortcutCommand(parameter); // Call the function with the parameter
    });

    // Clean up the listener when the component unmounts
    return () => {
      ipcRenderer.removeAllListeners('shortcut-pressed');
    };
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen">
      <WindowsControls />
      <Toaster toastOptions={{ className: '',style:{ background: '#000329', color: '#FFFFFF'}}} />
      <div className="flex flex-row w-full h-full overflow-hidden">
        <Sidebar onFormButtonClick={openForm} onEditButtonClick={toggleEditor} isEditing={isEditing} formState={formState} connectToOBS={connectToOBS} onSettingsButtonClick={onSettingsButtonClick} onHotkeyFormButtonClick={onHotkeyFormButtonClick} obsConnected={obsConnected} connectToTwitch={connectToTwitch} isTwitchConnected={isTwitchConnected} />
        <div className="overflow-y-scroll w-full h-full scrollbar scrollbar-thumb-gray-500 hover:scrollbar-thumb-slate-500 scrollbar-track-gray-700">
          {formState === "macroArea" && <MacroArea macros={macros} isEditing={isEditing} setMacros={setMacros} deleteMacro={deleteMacro} openEditMacroForm={openEditMacroForm} checkConnection={checkConnection} toastErrorMessage={toastErrorMessage}></MacroArea>}
          {formState === "addMacroForm" && <AddMacroForm closeForm={closeForm} addMacro={addMacro} toastErrorMessage={toastErrorMessage}></AddMacroForm>}
          {formState === "editMacroForm" && <AddMacroForm closeForm={closeForm} addMacro={addMacro} toastErrorMessage={toastErrorMessage} editMode={true} macroToEdit={macros[macroIndex]}></AddMacroForm>}
          {formState === "settingsForm" && <SettingsForm closeForm={closeForm} setObsPort={setObsPort} setObsPassword={setObsPassword} saveSettings={saveSettings} obsPort={obsPort} obsPassword={obsPassword} twitchUsername={twitchUsername} setTwitchUsername={setTwitchUsername} isTwitchConnected={isTwitchConnected} connectToTwitch={connectToTwitch} isRevokingTwitchToken={isRevokingTwitchToken} setIsRevokingTwitchToken={setIsRevokingTwitchToken} disconnectFromTwitch={disconnectFromTwitch} verifyTwitchConnection={verifyTwitchConnection}></SettingsForm>}
          {formState === "hotkeyForm" && <HotkeyManager macros={macros}></HotkeyManager>}
        </div>
      </div>
    </div>
  );
}

export default App;

import { React, useEffect, useState} from 'react';
import Sidebar from './components/Sidebar';
import WindowsControls from './components/WindowsControls';
import MacroArea from './components/macroArea';
import AddMacroForm from './components/addMacroForm';
import { Toaster, toast } from 'react-hot-toast';
import { ipcRenderer } from "electron";

function App() {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [macros, setMacros] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [obsConnected, setObsConnected] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [firstRun, setFirstRun] = useState(true);

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

  async function saveMacros(macros) {
    try {
      const response = await ipcRenderer.invoke('save-macros', macros);
      //console.log(response);
    } catch (error) {
      console.error('Failed to save macros:', error);
    }
  }
  
  async function loadMacros() {
    try {
      const macros = await ipcRenderer.invoke('load-macros');
      //console.log(macros);
      setMacros(macros);
    } catch (error) {
      console.error('Failed to load macros:', error);
    }
  }

  const connectToOBS = async () => {
    const response = await fetch('http://localhost:3000/connect-to-obs');
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
    if(!isFormVisible) {
      setIsEditing(false);
      setIsFormVisible(true);
    }
  }

  const closeForm = () => {
    if(isFormVisible) {
      setIsFormVisible(false);
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
    if(!isFormVisible) {
      setIsEditing(!isEditing);
    }
    saveMacros(macros);
  }

  useEffect(() => {
    if (!hasRun) {
      checkConnection();
      // toast.success('This is a success message!');
      loadMacros();
      setHasRun(true);
    }
  }, [hasRun]);

  const toastErrorMessage = (message) => {
    toast.error(message);
  }

  const toastSuccessMessage = (message) => {
    toast.success(message);
  }

  return (
    <div className="flex flex-col h-screen bg-slate-700 overflow-hidden">
      <WindowsControls />
      <Toaster toastOptions={{ className: '',style:{ background: '#000329', color: '#FFFFFF'}}} />
      <div className="flex flex-row flex-grow">
        <Sidebar onFormButtonClick={openForm} onEditButtonClick={toggleEditor} isEditing={isEditing} isFormVisible={isFormVisible} connectToOBS={connectToOBS} obsConnected={obsConnected} />
        <div className="flex-grow">
          {!isFormVisible && <MacroArea macros={macros} isEditing={isEditing} setMacros={setMacros} deleteMacro={deleteMacro} checkConnection={checkConnection}></MacroArea>}
          {isFormVisible && <AddMacroForm closeForm={closeForm} addMacro={addMacro}></AddMacroForm>}
        </div>
      </div>
    </div>
  );
}

export default App;

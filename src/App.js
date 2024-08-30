import { React, useEffect, useState} from 'react';
import Sidebar from './components/Sidebar';
import WindowsControls from './components/WindowsControls';
import MacroArea from './components/macroArea';
import AddMacroForm from './components/addMacroForm';
import { Toaster, toast } from 'react-hot-toast';

function App() {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [macros, setMacros] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [obsConnected, setObsConnected] = useState(false);

  const checkConnection = async () => {
    const response = await fetch('http://localhost:3000/check-connection');
    if(response.status === 200) {
      setObsConnected(true);
    }
    else {
      setObsConnected(false);
      //toast.error('No OBS connection');
    }
  }

  const saveMacros = () => {
    localStorage.setItem('macros', JSON.stringify(macros));
  }

  const connectToOBS = async () => {
    const response = await fetch('http://localhost:3000/connect-to-obs');
    if(response.status === 200) {
      setObsConnected(true);
    }
    else {
      setObsConnected(false);
      //toast.error('Failed to connect to OBS');
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
    console.log(macros);
  }

  const deleteMacro = (index) => {
    setMacros(macros.filter((_, i) => i !== index)); // Remove macro from the list
  }

  const toggleEditor = () => {
    if(!isFormVisible) {
      setIsEditing(!isEditing);
    }
  }

  useEffect(() => {
    checkConnection();
    //toast.success('This is a success message!');
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-700 overflow-hidden">
      <WindowsControls />
      <Toaster />
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

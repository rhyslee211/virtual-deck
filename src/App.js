import { React, useState} from 'react';
import Sidebar from './components/Sidebar';
import WindowsControls from './components/WindowsControls';
import MacroArea from './components/macroArea';
import AddMacroForm from './components/addMacroForm';

function App() {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [macros, setMacros] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

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

  const toggleEditor = () => {
    if(!isFormVisible) {
      setIsEditing(!isEditing);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-700 overflow-hidden">
      <WindowsControls />
      <div className="flex flex-row flex-grow">
        <Sidebar onFormButtonClick={openForm} onEditButtonClick={toggleEditor} isEditing={isEditing} isFormVisible={isFormVisible}/>
        <div className="flex-grow">
          {!isFormVisible && <MacroArea macros={macros} isEditing={isEditing} setMacros={setMacros}></MacroArea>}
          {isFormVisible && <AddMacroForm closeForm={closeForm} addMacro={addMacro}></AddMacroForm>}
        </div>
      </div>
    </div>
  );
}

export default App;

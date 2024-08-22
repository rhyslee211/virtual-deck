import { React, useState} from 'react';
import Sidebar from './components/Sidebar';
import WindowsControls from './components/WindowsControls';
import MacroArea from './components/macroArea';
import AddMacroForm from './components/addMacroForm';

function App() {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [macros, setMacros] = useState([]);

  const openForm = () => {
    setIsFormVisible(true);
  }

  const closeForm = () => {
    setIsFormVisible(false);
  }

  const addMacro = (newMacro) => {
    setMacros([...macros, newMacro]); // Add new macro to the list
  }

  return (
    <div className="flex flex-col h-screen bg-slate-700">
      <WindowsControls />
      <div className="flex flex-row flex-grow">
        <Sidebar onFormButtonClick={openForm} />
        <div className="flex-grow">
          {!isFormVisible && <MacroArea macros={macros}></MacroArea>}
          {isFormVisible && <AddMacroForm closeForm={closeForm} addMacro={addMacro}></AddMacroForm>}
        </div>
      </div>
    </div>
  );
}

export default App;

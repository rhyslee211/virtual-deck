import React from 'react';
import Sidebar from './components/Sidebar';
import WindowsControls from './components/WindowsControls';

function App() {
  return (
    <div className="flex flex-col h-screen bg-slate-700">
      <WindowsControls />
      <div className="flex flex-row flex-grow">
        <Sidebar />
        <div className="flex-grow">
          <h1 className="text-sm text-blue-500 font-bold underline">
            Hello world!!!!!!!!!!!!!
          </h1>
        </div>
      </div>
    </div>
  );
}

export default App;

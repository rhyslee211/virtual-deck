import React from 'react';
import WindowsControls from './components/WindowsControls';

function App() {
  return (
    <div className="flex flex-col h-screen bg-slate-800">
      <WindowsControls />
      <h1 className="text-sm text-blue-500 font-bold underline">
        Hello world!!!!
      </h1>
    </div>
  );
}

export default App;

import { useState } from 'react';
import './App.css';
import NavComponent from "./components/Navigation/NavComponent";

function App() {
  return (
    <>
      {/* Header with NavComponent */}
      <header className="p-4 bg-gray-100 flex justify-end">
        <NavComponent />
      </header>
      {/* ...existing content... */}
    </>
  );
}

export default App;

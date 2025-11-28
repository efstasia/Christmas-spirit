import './App.css'
import { Dashboard } from './pages/Dashboard';
import { Routes, Route } from "react-router-dom";
import { ChristmasPresents } from './components/ChristmasPresents';
import { Navigation } from './components/Navigation';

function App() {

  return (
    <>
    <Navigation />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/presents" element={<ChristmasPresents />} />
      </Routes>
    </>
  )
}

export default App

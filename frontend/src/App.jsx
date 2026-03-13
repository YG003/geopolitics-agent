import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Briefing from './pages/Briefing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/briefing" element={<Briefing />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Landing from './pages/landing'
import ScrollToTop from "./assets/toScrollTop";
import HouseholdProfile from "./pages/a-user/home-page";
import Rewards from "./pages/a-user/reward";
import Leaderboard from "./pages/a-user/leaderboard";





function App() {

  return (
    <Router>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home-page" element={<HouseholdProfile/>}/>
        <Route path="/rewards" element={<Rewards />} />
         <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  )
}

export default App

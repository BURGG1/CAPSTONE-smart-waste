import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Landing from './pages/landing'
import ScrollToTop from "./assets/toScrollTop";
import HouseholdProfile from "./pages/a-user/home-page";
import Rewards from "./pages/a-user/reward";
import Leaderboard from "./pages/a-user/leaderboard";
import ComplianceDashboard from "./pages/a-admin/dashboard";
import BinMonitoring from "./pages/a-admin/binMonitoring";
import HouseholdInfo from "./pages/a-admin/householdInfo";





function App() {

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* User */}
        <Route path="/" element={<Landing />} />
        <Route path="/home-page" element={<HouseholdProfile />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        {/* Admin */}
        <Route path="/dashboard" element={<ComplianceDashboard />} />
        <Route path="/binMonitoring" element={<BinMonitoring />} />
         <Route path="/householdInfo" element={<HouseholdInfo />} />
      </Routes>
    </Router>
  )
}

export default App

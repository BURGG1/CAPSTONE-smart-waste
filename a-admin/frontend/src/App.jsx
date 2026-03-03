import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react'
import Landing from './pages/landing'
import ScrollToTop from "./assets/toScrollTop";
import HouseholdProfile from "./pages/a-user/profile";
import Rewards from "./pages/a-user/reward";
import Leaderboard from "./pages/a-user/leaderboard";
import ComplianceDashboard from "./pages/a-admin/dashboard";
import BinMonitoring from "./pages/a-admin/binMonitoring";
import HouseholdInfo from "./pages/a-admin/householdInfo";
import AuthPage from "./pages/authPage";
import Gamified from "./pages/a-admin/gamified";
import QRhandler from "./pages/a-user/QRhandler";
import WasteBin from "./pages/a-admin/wastebin";
import HomePage from "./pages/a-user/home";





function App() {

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/landing" element={<Landing />} />
        {/* User */}
        <Route path="/home" element={<HomePage/>} />
        <Route path="/qrcode" element={<QRhandler />} />
        <Route path="/home-page" element={<HouseholdProfile />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        {/* Admin */}
        <Route path="/dashboard" element={<ComplianceDashboard />} />
        <Route path="/wastebin" element={<WasteBin />} />
        <Route path="/binMonitoring" element={<BinMonitoring />} />
        <Route path="/householdInfo" element={<HouseholdInfo />} />
        <Route path="/gamified" element={<Gamified />} />
      </Routes>
    </Router>
  )
}

export default App

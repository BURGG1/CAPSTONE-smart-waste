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
import AuthPage from "./pages/authPage";
import Gamified from "./pages/a-admin/gamified";
import QRhandler from "./pages/a-user/QRhandler";
import WasteBin from "./pages/a-admin/wastebin";





function App() {

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/Login" element={<AuthPage />} />
        <Route path="/" element={<Landing />} />
        {/* User */}
        <Route path="/qrcode" element={<QRhandler />} />
        <Route path="/home-page" element={<HouseholdProfile />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/gamified" element={<Gamified />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        {/* Admin */}
        <Route path="/dashboard" element={<ComplianceDashboard />} />
        <Route path="/wastebin" element={<WasteBin />} />
        <Route path="/binMonitoring" element={<BinMonitoring />} />
        <Route path="/householdInfo" element={<HouseholdInfo />} />
      </Routes>
    </Router>
  )
}

export default App

import { Recycle, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate("/home-page"); 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/"); 
  };

  return (
    <header className="w-full bg-white border-b sticky top-0 z-100">
      <div className="max-w-full px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-green-500 rounded-lg flex items-center justify-center">
            <Recycle className="text-white" size={20} />
          </div>
          <span className="font-bold text-lg text-black">SmartBin</span>
        </div>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-500 cursor-pointer font-medium"
          >
            <LogOut size={16} />
            Logout
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1 text-green-600 cursor-pointer font-medium"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
}

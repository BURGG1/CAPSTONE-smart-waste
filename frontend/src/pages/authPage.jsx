import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  User,
} from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); 
    const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/home-page"); 
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md text-center space-y-6">

        {/* LOGO */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <Leaf className="text-white" size={32} />
          </div>
          <h1 className="text-xl font-semibold">
            Community Waste Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage waste collection efficiently
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

          <h2 className="text-lg font-medium">Welcome Back!</h2>

          

          {/* FORM */}
          <form className="space-y-4 text-left">

            {/* FULL NAME (REGISTER ONLY) */}
            {mode === "register" && (
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                icon={<User size={18} />}
              />
            )}

            {/* EMAIL */}
            <Input
              label="Email"
              placeholder="Enter your email"
              icon={<Mail size={18} />}
            />

            {/* PASSWORD */}
            <Input
              label="Password"
              placeholder={
                mode === "login"
                  ? "Enter your password"
                  : "Create a password"
              }
              type="password"
              icon={<Lock size={18} />}
            />

            {/* CONFIRM PASSWORD (REGISTER ONLY) */}
            {mode === "register" && (
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                type="password"
                icon={<Lock size={18} />}
              />
            )}

            {/* BUTTON */}
            <button
              onClick={handleLogin}  
              type="button"
              className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition"
            >
              {mode === "login" ? "Login" : "Register"}
            </button>
          </form>

          {/* FOOTER */}
          {mode === "login" && (
            <p className="text-sm text-gray-500">
              Forgot your password?{" "}
              <span className="text-green-600 font-medium cursor-pointer">
                Reset here
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


function Input({ label, placeholder, icon, type = "text" }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-50">
        <span className="text-gray-400">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>
    </div>
  );
}

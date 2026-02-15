import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff

} from "lucide-react";



export default function AuthPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [access, setAccess] = useState();


  // temporary login
  const handleLogin = () => {
    if (form.email === "admin" && form.password === "admin1234") {
      localStorage.setItem("role", "admin");
      navigate("/dashboard");
    } else {
      localStorage.setItem("role", "user");
       navigate("/qrcode");
    }
  };


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });


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

          {/* Email */}
          <div className="space-y-1">
            <label className="block text-start text-bold text-sm mb-1">Email</label>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-50">
              <span>
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full bg-transparent outline-none pl-4"
                required
              />

            </div>
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm text-start mb-1">Password</label>
            <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-50">
              <span>
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none pl-4"
                required
              />
            </div>

          </div>

          <button
            onClick={handleLogin}
            type="button"
            className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition"
          >
            Login
          </button>

          <p className="text-sm text-gray-500">
            Forgot your password?{" "}
            <span className="text-green-600 font-medium cursor-pointer">
              Reset here
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

import { NavLink } from "react-router-dom";

import { Home, Gift, Trophy } from "lucide-react";

const menu = [
  { name: "My Profile", icon: Home, path: "/home-page" },
  { name: "Rewards", icon: Gift, path: "/rewards" },
  { name: "Leaderboard", icon: Trophy, path: "/leaderboard" },
];


export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 bg-white border-r min-h-screen p-4 sticky">
      <div className="w-full">
     
        <nav className="space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition
                ${
                  isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>


      </div>
    </aside>
  );
}

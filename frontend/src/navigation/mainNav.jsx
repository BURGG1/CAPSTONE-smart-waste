import {
    Home,
    Gift,
    TrendingUpDown,
    Trash2,
    Star,
    QrCode,
    Trophy,
} from "lucide-react";

import { Sidebar } from "./Sidebar";
import { MobileDrawer } from "./navDrawer";
import { BottomNav } from "./bottomNav";
import { useState } from "react";

const userMenu = [
    { name: "QR-Code", icon: QrCode, path: "/qrcode" },
    { name: "My Profile", icon: Home, path: "/home-page" },
    { name: "Rewards", icon: Gift, path: "/rewards" },
    { name: "Leaderboard", icon: Trophy, path: "/leaderboard" },
];

const adminMenu = [
    { name: "Dashboard", icon: TrendingUpDown, path: "/dashboard" },
    { name: "Household Information", icon: Home, path: "/householdInfo" },
    { name: "Waste bin Segregation", icon: Trash2, path: "/wastebin" },
    { name: "Bin Monitoring", icon: Trash2, path: "/binMonitoring" },
    { name: "Reward Management", icon: Star, path: "/gamified" },
]

export default function NavigationShell() {
    const role = "admin"
    const isAdmin = role === "admin";

    return (
        <>
            <Sidebar menu={isAdmin ? adminMenu : userMenu} />
            {console.log("role:", role, "isAdmin:", isAdmin)}

            {isAdmin ? (
                <MobileDrawer menu={adminMenu} />
            ) : (
                <BottomNav menu={userMenu} />
            )}
        </>
    );
}

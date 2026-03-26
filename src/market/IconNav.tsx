import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, BarChart3, Users, Building2, FileText, Settings, Home } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", id: "home" },
  { icon: LayoutGrid, label: "Market Insights", id: "market" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Users, label: "Contacts", id: "contacts" },
  { icon: Building2, label: "Firms", id: "firms" },
  { icon: FileText, label: "Reports", id: "reports" },
  { icon: Settings, label: "Settings", id: "settings" },
];

export default function IconNav() {
  const [active, setActive] = useState("market");

  return (
    <div className="w-14 bg-white border-r border-[#e5e7eb] flex flex-col items-center py-4 gap-1">
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActive(item.id)}
          className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            active === item.id
              ? "bg-[#5265F5] text-white"
              : "text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-foreground"
          }`}
          title={item.label}
        >
          {active === item.id && (
            <motion.div
              layoutId="activeNav"
              className="absolute inset-0 rounded-lg bg-[#5265F5]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <item.icon className="w-5 h-5 relative z-10" />
        </motion.button>
      ))}
    </div>
  );
}

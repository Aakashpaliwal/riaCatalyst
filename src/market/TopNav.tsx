import { motion } from "framer-motion";
import { Search, Bell, User } from "lucide-react";

export default function TopNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b border-[#e5e7eb] dark:border-gray-700"
    >
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#5265F5] flex items-center justify-center">
            <span className="text-white font-semibold text-sm">RC</span>
          </div>
        </div>

        {/* Global search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9ca3af]" />
          <input
            type="text"
            placeholder="Search by name or CRD..."
            className="pl-10 pr-4 py-2 w-56 rounded-lg bg-[#f3f4f6] dark:bg-gray-800 text-sm text-foreground placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#5265F5]/30 border-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-lg hover:bg-[#f3f4f6] dark:hover:bg-gray-800 transition-colors"
        >
          <Bell className="w-5 h-5 text-[#6b7280]" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-full bg-[#5265F5]/10 flex items-center justify-center"
        >
          <User className="w-4 h-4 text-[#5265F5]" />
        </motion.button>
      </div>
    </motion.header>
  );
}

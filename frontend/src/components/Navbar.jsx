"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { IconMoonStars, IconSun } from "@tabler/icons-react";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconBuilding,
  IconCalendarEvent,
  IconCheck,
  IconClock,
  IconUsers,
  IconLogout
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SidebarDemo() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = (checked) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/validate", {
          withCredentials: true,
        });
        setIsAdmin(res.data.isAdmin);
      } catch (err) {
        console.error("Failed to fetch user role", err);
        setIsAdmin(false);
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const adminLinks = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Employee Table",
      href: "/employee-table",
      icon: <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Leave Approval",
      href: "/leave-approval",
      icon: <IconCheck className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Add Fields",
      href: "/addfields",
      icon: <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Attendance",
      href: "/attendance",
      icon: <IconClock className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Events",
      href: "/events",
      icon: <IconCalendarEvent className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  const employeeLinks = [
    {
      label: "My Dashboard",
      href: "/employee/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Events",
      href: "/employee/events",
      icon: <IconCalendarEvent className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Leave Requests", // Added Leave link for employees
      href: "/employee/leave-requests", // Adjust the path to the leave requests page
      icon: <IconClock className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  return (
    <div className={cn("flex w-full h-screen flex-row bg-gray-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            

            {open ? <Logo /> : <LogoIcon />}

            <div className="mt-8 flex flex-col gap-2">
              {(isAdmin ? adminLinks : employeeLinks).map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-left text-neutral-700 dark:text-neutral-200 hover:underline px-2 py-1"
              >
                <IconLogout className="h-5 w-5 shrink-0" /> Logout
              </button>
            </div>
          </div>
          <div>

         
     
  {open ? (
    <DarkModeSwitch darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
  ) : (
    <DarkModeIcon darkMode={darkMode} />
  )}


           

            <SidebarLink
              link={{
                label: isAdmin ? "Admin" : "Employee",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
}

export const DarkModeSwitch = ({ darkMode, toggleDarkMode }) => (
  <div className="flex items-center gap-2">
    <div className="text-neutral-700 dark:text-neutral-200">
    {darkMode ? (
      <IconMoonStars size={20} stroke={1.5} />
    ) : (
      <IconSun size={20} stroke={1.5} />
    )}
  </div>
    <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
  </div>
);

export const DarkModeIcon = ({ darkMode }) => (
  <div className="text-neutral-700 dark:text-neutral-200">
    {darkMode ? (
      <IconMoonStars size={20} stroke={1.5} />
    ) : (
      <IconSun size={20} stroke={1.5} />
    )}
  </div>
);

export const Logo = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium whitespace-pre text-black dark:text-white">
      Acet Labs
    </motion.span>
  </a>
);

export const LogoIcon = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
  </a>
);

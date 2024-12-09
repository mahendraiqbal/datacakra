"use client";

import React from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Layers, LogOut, User } from "lucide-react";

interface SidebarProps {
  onMenuClick: (menu: string) => void;
}

export default function Sidebar({ onMenuClick }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: "Apakah Anda yakin ingin logout?",
      text: "Anda akan dialihkan ke halaman Landing Page",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        Swal.fire({
          title: "Logout Berhasil!",
          text: "Anda telah berhasil logout",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        router.push("/");
      }
    });
  };

  return (
    <div className="pt-6">
      <aside className="h-full w-64 bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-xl">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <User className="w-10 h-10 text-blue-300" />
            <div>
              <h2 className="text-xl font-bold">Travelist</h2>
              <p className="text-sm text-blue-200 opacity-75">
                Enjoy Your Journey
              </p>
            </div>
          </div>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {[
              {
                name: "Dashboard",
                icon: LayoutDashboard,
                menu: "dashboard",
              },
              {
                name: "Article List",
                icon: FileText,
                menu: "articles",
              },
              {
                name: "Article View",
                icon: FileText,
                menu: "articlesView",
              },
              {
                name: "Category",
                icon: Layers,
                menu: "category",
              },
            ].map((item) => (
              <li key={item.menu}>
                <button
                  onClick={() => onMenuClick(item.menu)}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
                >
                  <item.icon className="w-5 h-5 mr-3 text-blue-300 group-hover:text-white transition-colors" />
                  <span className="font-medium">{item.name}</span>
                </button>
              </li>
            ))}
            <li className="mt-4 border-t border-white/20 pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center p-3 rounded-lg hover:bg-red-500/20 text-red-300 hover:text-red-100 transition-colors duration-200 group"
              >
                <LogOut className="w-5 h-5 mr-3 text-red-300 group-hover:text-red-100 transition-colors" />
                <span className="font-medium">Log Out</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

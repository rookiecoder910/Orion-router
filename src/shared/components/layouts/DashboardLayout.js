"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useNotificationStore } from "@/store/notificationStore";
import Sidebar from "../Sidebar";
import Header from "../Header";

function getToastStyle(type) {
  if (type === "success") {
    return {
      wrapper: "border-primary bg-surface-2 text-primary",
      prefix: "OK",
      icon: "check_circle",
    };
  }
  if (type === "error") {
    return {
      wrapper: "border-danger bg-surface-2 text-danger",
      prefix: "ERR",
      icon: "error",
    };
  }
  if (type === "warning") {
    return {
      wrapper: "border-secondary bg-surface-2 text-secondary",
      prefix: "WARN",
      icon: "warning",
    };
  }
  return {
    wrapper: "border-info bg-surface-2 text-info",
    prefix: "INFO",
    icon: "info",
  };
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg font-mono text-text-main relative">
      {/* CRT Scanline Overlay */}
      <div className="crt-overlay pointer-events-none fixed inset-0 z-50" aria-hidden="true" />

      {/* Terminal Notification Stack */}
      <div className="fixed top-4 right-4 z-[80] flex w-[min(92vw,400px)] flex-col gap-2 font-mono">
        {notifications.map((n) => {
          const style = getToastStyle(n.type);
          return (
            <div
              key={n.id}
              className={`border px-3 py-2 bg-surface shadow-none text-xs ${style.wrapper}`}
            >
              <div className="flex items-start gap-2">
                <span className="font-bold select-none text-[11px]">[{style.prefix}]</span>
                <div className="min-w-0 flex-1">
                  {n.title ? (
                    <p className="font-bold uppercase tracking-wider mb-0.5">{n.title}</p>
                  ) : null}
                  <p className="text-[12px] whitespace-pre-wrap break-words">{n.message}</p>
                </div>
                {n.dismissible ? (
                  <button
                    type="button"
                    onClick={() => removeNotification(n.id)}
                    className="text-current opacity-70 hover:opacity-100 hover:bg-current/20 px-1 text-[11px]"
                    aria-label="Dismiss notification"
                  >
                    [x]
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:flex border-r border-border">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:hidden transition-transform duration-200 ease-in-out border-r border-border bg-bg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content pane */}
      <main className="flex flex-col flex-1 h-full min-w-0 relative transition-colors isolate">
        {/* Terminal Grid Background */}
        <div className="landing-grid absolute inset-0 pointer-events-none -z-10 opacity-60" aria-hidden="true" />
        <Header key={pathname} onMenuClick={() => setSidebarOpen(true)} />
        <div
          className={`flex-1 overflow-y-auto custom-scrollbar ${
            pathname === "/dashboard/basic-chat" ? "" : "p-4 sm:p-6 lg:p-8"
          } ${pathname === "/dashboard/basic-chat" ? "flex flex-col overflow-hidden" : ""}`}
        >
          <div
            className={`${
              pathname === "/dashboard/basic-chat" ? "flex-1 w-full h-full flex flex-col" : "max-w-7xl mx-auto"
            }`}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

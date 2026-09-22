"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/shared/hooks/useTheme";
import ChangelogModal from "./ChangelogModal";
import { ConfirmModal } from "./Modal";

function MenuItem({ icon, label, onClick, trailing, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-mono tracking-wider uppercase transition-none cursor-pointer ${
        danger
          ? "text-danger hover:bg-danger hover:text-black"
          : "text-text-main hover:bg-primary hover:text-black"
      }`}
    >
      <span className="select-none opacity-60">&gt;</span>
      <span className="flex-1 text-left truncate">{label}</span>
      {trailing && <span className="text-xs">{trailing}</span>}
    </button>
  );
}


export default function HeaderMenu({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const { toggleTheme, isDark } = useTheme();
  const menuRef = useRef(null);

  const handleShutdown = async () => {
    setIsShuttingDown(true);
    try {
      await fetch("/api/version/shutdown", { method: "POST" });
    } catch (e) {
      // Expected to fail as server shuts down
    }
    setIsShuttingDown(false);
    setShutdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <div className="relative font-mono" ref={menuRef}>
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="px-2 py-1 border border-border text-xs text-text-muted hover:text-primary hover:border-primary transition-none rounded-none cursor-pointer"
          title="System Menu"
        >
          <span>[SYS]</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-52 bg-surface border border-primary rounded-none shadow-none z-50 py-1">
            <div className="px-3 py-1 text-[10px] text-text-muted border-b border-border mb-1 select-none">
              +--- SYSTEM MENU ---+
            </div>
            <MenuItem
              icon="history"
              label="Change Log"
              onClick={() => { close(); setChangelogOpen(true); }}
            />
            <MenuItem
              icon="power_settings_new"
              label="Halt Daemon"
              danger
              onClick={() => { close(); setShutdownOpen(true); }}
            />
            <MenuItem
              icon="logout"
              label="Terminate Session"
              danger
              onClick={() => { close(); onLogout(); }}
            />
          </div>
        )}
      </div>

      <ChangelogModal isOpen={changelogOpen} onClose={() => setChangelogOpen(false)} />
      <ConfirmModal
        isOpen={shutdownOpen}
        onClose={() => setShutdownOpen(false)}
        onConfirm={handleShutdown}
        title="SHUTDOWN DAEMON"
        message="Terminate OrionRouter routing daemon? All active proxies and CLI tools will be halted."
        confirmText="HALT NOW"
        cancelText="ABORT"
        variant="danger"
        loading={isShuttingDown}
      />
    </>
  );
}


"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { APP_CONFIG, UPDATER_CONFIG } from "@/shared/constants/config";
import { MEDIA_PROVIDER_KINDS } from "@/shared/constants/providers";
import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import Button from "./Button";
import { ConfirmModal } from "./Modal";
import NineRemotePromoModal from "./NineRemotePromoModal";

const VISIBLE_MEDIA_KINDS = ["embedding", "image", "video", "tts", "stt", "systemone"];
const COMBINED_WEB_ITEM = { id: "web", label: "Web Fetch & Search", icon: "travel_explore", href: "/dashboard/media-providers/web" };

const navItems = [
  { href: "/dashboard/endpoint", label: "01_ENDPOINT & KEY", icon: "api" },
  { href: "/dashboard/providers", label: "02_PROVIDERS", icon: "dns" },
  { href: "/dashboard/combos", label: "03_COMBOS & VISION", icon: "layers" },
  { href: "/dashboard/usage", label: "04_USAGE & STATS", icon: "bar_chart" },
  { href: "/dashboard/quota", label: "05_QUOTA TRACKER", icon: "data_usage" },
  { href: "/dashboard/token-saver", label: "06_TOKEN SAVER", icon: "savings" },
  { href: "/dashboard/cli-tools", label: "07_CLI TOOLS", icon: "terminal" },
];

const debugItems = [
  { href: "/dashboard/console-log", label: "08_CONSOLE LOG", icon: "terminal" },
  { href: "/dashboard/translator", label: "09_TRANSLATOR", icon: "translate" },
];

const systemItems = [
  { href: "/dashboard/proxy-pools", label: "10_PROXY POOLS", icon: "lan" },
  { href: "/dashboard/skills", label: "11_SKILLS", icon: "extension" },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const [mediaOpen, setMediaOpen] = useState(false);
  const [showRemoteModal, setShowRemoteModal] = useState(false);
  const [isDisconnected, setIsDisconnected] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [shutdownCountdown, setShutdownCountdown] = useState(0);
  const [enableTranslator, setEnableTranslator] = useState(false);
  const { copied, copy } = useCopyToClipboard(2000);

  const INSTALL_CMD = UPDATER_CONFIG.installCmdLatest;

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => { if (data.enableTranslator) setEnableTranslator(true); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/version")
      .then(res => res.json())
      .then(data => { if (data.hasUpdate) setUpdateInfo(data); })
      .catch(() => {});
  }, []);

  const isActive = (href) => {
    if (href === "/dashboard/endpoint") {
      return pathname === "/dashboard" || pathname.startsWith("/dashboard/endpoint");
    }
    return pathname.startsWith(href);
  };

  const handleUpdate = () => {
    setShowUpdateModal(false);
    setIsUpdating(true);
  };

  const handleCopyAndShutdown = async () => {
    try { await navigator.clipboard.writeText(INSTALL_CMD); } catch { /* ignore */ }
    copy(INSTALL_CMD);
    let remaining = UPDATER_CONFIG.shutdownCountdownSec;
    setShutdownCountdown(remaining);
    const timer = setInterval(() => {
      remaining -= 1;
      setShutdownCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        fetch("/api/version/shutdown", { method: "POST" }).catch(() => {});
        setIsDisconnected(true);
      }
    }, 1000);
  };

  const handleCancelUpdate = () => {
    setIsUpdating(false);
    setShutdownCountdown(0);
  };

  return (
    <>
      <aside className="flex w-72 flex-col bg-surface font-mono text-text-main select-none min-h-full border-r border-border">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">[SYS]</span>
            <span className="text-text-muted text-[11px]">tty1@orionrouter</span>
          </div>
          <span className="text-primary animate-pulse text-[10px]">[ONLINE]</span>
        </div>

        {/* ASCII Art Logo & System Details */}
        <div className="p-3 border-b border-border bg-surface flex flex-col gap-2">
          <Link href="/dashboard" className="block text-primary hover:opacity-90">
            <pre className="text-[9px] leading-[10px] font-mono text-primary select-none whitespace-pre overflow-hidden">
{`  ___  ____  ___ ___  _   _ 
 / _ \\|  _ \\|_ _/ _ \\| \\ | |
| | | | |_) || | | | |  \\| |
| |_| |  _ < | | |_| | |\\  |
 \\___/|_| \\_\\___\\___/|_| \\_|`}
            </pre>
            <div className="mt-2 flex items-center justify-between text-[11px] border-t border-border/40 pt-1.5 text-text-muted">
              <span className="font-bold text-primary">// ORION ROUTER</span>
              <span className="text-text-muted">v{APP_CONFIG.version}</span>
            </div>
          </Link>

          {/* Update notice */}
          {updateInfo && (
            <div className="border border-warning bg-warning/10 p-2 text-xs text-warning flex flex-col gap-1.5">
              <span className="font-bold">[!] RELEASE: v{updateInfo.latestVersion}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="px-2 py-0.5 bg-warning text-black font-bold text-[10px] hover:bg-warning/80 cursor-pointer"
                >
                  [UPDATE]
                </button>
                <button
                  onClick={() => copy(INSTALL_CMD)}
                  className="text-[10px] text-warning/80 hover:text-warning truncate cursor-pointer font-mono"
                >
                  {copied ? "[COPIED!]" : "[COPY_CMD]"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Pane */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar text-xs">
          <div className="px-2 py-1 text-[10px] text-text-subtle font-bold tracking-wider">
            // MAIN_NAVIGATION
          </div>

          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 transition-none uppercase tracking-wider text-xs border",
                  active
                    ? "bg-primary text-black font-bold border-primary"
                    : "text-text-muted border-transparent hover:border-border hover:bg-surface-2 hover:text-primary"
                )}
              >
                <span className="select-none text-current opacity-80">&gt;</span>
                <span className="truncate">{item.label}</span>
                {active && <span className="ml-auto select-none animate-terminal-blink">█</span>}
              </Link>
            );
          })}

          {/* System section */}
          <div className="pt-2">
            <div className="px-2 py-1 text-[10px] text-text-subtle font-bold tracking-wider">
              // SUBSYSTEMS
            </div>

            {/* Media Providers accordion */}
            <button
              onClick={() => setMediaOpen((v) => !v)}
              className={cn(
                "w-full flex items-center gap-2 px-2.5 py-1.5 text-xs uppercase tracking-wider border cursor-pointer",
                pathname.startsWith("/dashboard/media-providers")
                  ? "bg-primary/20 text-primary border-primary"
                  : "text-text-muted border-transparent hover:border-border hover:bg-surface-2 hover:text-primary"
              )}
            >
              <span className="select-none text-current opacity-80">&gt;</span>
              <span className="truncate flex-1 text-left">MEDIA PROVIDERS</span>
              <span className="text-[10px]">{mediaOpen ? "[-]" : "[+]"}</span>
            </button>

            {mediaOpen && (
              <div className="pl-3 border-l border-border/60 ml-2 mt-1 space-y-0.5">
                {MEDIA_PROVIDER_KINDS.filter((k) => VISIBLE_MEDIA_KINDS.includes(k.id)).map((kind) => (
                  <Link
                    key={kind.id}
                    href={`/dashboard/media-providers/${kind.id}`}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1 text-[11px] uppercase tracking-wider border",
                      pathname.startsWith(`/dashboard/media-providers/${kind.id}`)
                        ? "bg-primary text-black font-bold border-primary"
                        : "text-text-muted border-transparent hover:border-border hover:bg-surface-2 hover:text-primary"
                    )}
                  >
                    <span className="select-none text-current opacity-60">$</span>
                    <span className="truncate">{kind.label}</span>
                  </Link>
                ))}
                <Link
                  key={COMBINED_WEB_ITEM.id}
                  href={COMBINED_WEB_ITEM.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 text-[11px] uppercase tracking-wider border",
                    pathname.startsWith(COMBINED_WEB_ITEM.href)
                      ? "bg-primary text-black font-bold border-primary"
                      : "text-text-muted border-transparent hover:border-border hover:bg-surface-2 hover:text-primary"
                  )}
                >
                  <span className="select-none text-current opacity-60">$</span>
                  <span className="truncate">{COMBINED_WEB_ITEM.label}</span>
                </Link>
              </div>
            )}

            {systemItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 transition-none uppercase tracking-wider text-xs border",
                    active
                      ? "bg-primary text-black font-bold border-primary"
                      : "text-text-muted border-transparent hover:border-border hover:bg-surface-2 hover:text-primary"
                  )}
                >
                  <span className="select-none text-current opacity-80">&gt;</span>
                  <span className="truncate">{item.label}</span>
                  {active && <span className="ml-auto select-none animate-terminal-blink">█</span>}
                </Link>
              );
            })}

            {debugItems.map((item) => {
              const show = item.href !== "/dashboard/translator" || enableTranslator;
              const active = isActive(item.href);
              return show ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 transition-none uppercase tracking-wider text-xs border",
                    active
                      ? "bg-primary text-black font-bold border-primary"
                      : "text-text-muted border-transparent hover:border-border hover:bg-surface-2 hover:text-primary"
                  )}
                >
                  <span className="select-none text-current opacity-80">&gt;</span>
                  <span className="truncate">{item.label}</span>
                  {active && <span className="ml-auto select-none animate-terminal-blink">█</span>}
                </Link>
              ) : null;
            })}

            {/* Remote */}
            <button
              onClick={() => setShowRemoteModal(true)}
              className="flex items-center gap-2 px-2.5 py-1.5 uppercase tracking-wider text-xs border border-transparent text-text-muted hover:border-border hover:bg-surface-2 hover:text-primary w-full text-left cursor-pointer"
            >
              <span className="select-none text-current opacity-80">&gt;</span>
              <span className="truncate">9REMOTE</span>
              <span className="ml-auto text-[10px] text-primary border border-primary px-1">[NEW]</span>
            </button>

            {/* Settings */}
            <Link
              href="/dashboard/profile"
              onClick={onClose}
              className={cn(
                "flex items-center gap-2 px-2.5 py-1.5 transition-none uppercase tracking-wider text-xs border",
                isActive("/dashboard/profile")
                  ? "bg-primary text-black font-bold border-primary"
                  : "text-text-muted border-transparent hover:border-border hover:bg-surface-2 hover:text-primary"
              )}
            >
              <span className="select-none text-current opacity-80">&gt;</span>
              <span className="truncate">12_SYSTEM CONFIG</span>
              {isActive("/dashboard/profile") && <span className="ml-auto select-none animate-terminal-blink">█</span>}
            </Link>
          </div>
        </nav>

        {/* Status bar footer */}
        <div className="p-2.5 border-t border-border bg-surface-2 text-[11px] text-text-muted flex items-center justify-between">
          <span>PORT: 20128</span>
          <span className="text-primary font-bold">[READY]</span>
        </div>
      </aside>

      {/* Remote Promo Modal */}
      <NineRemotePromoModal isOpen={showRemoteModal} onClose={() => setShowRemoteModal(false)} />

      {/* Update Confirmation Modal */}
      <ConfirmModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onConfirm={handleUpdate}
        title="UPDATE ORIONROUTER"
        message={`Retrieve install command for v${updateInfo?.latestVersion || ""}? Server will shutdown cleanly.`}
        confirmText="GET COMMAND"
        cancelText="ABORT"
        variant="primary"
      />

      {/* Disconnected / Updating Overlay */}
      {(isDisconnected || isUpdating) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 font-mono">
          {isUpdating ? (
            <ManualUpdatePanel
              latestVersion={updateInfo?.latestVersion}
              installCmd={INSTALL_CMD}
              copied={copied}
              onCopyAndShutdown={handleCopyAndShutdown}
              onCancel={handleCancelUpdate}
              countdown={shutdownCountdown}
              isDisconnected={isDisconnected}
            />
          ) : (
            <div className="border border-danger bg-surface p-6 max-w-md w-full text-center">
              <span className="text-danger font-bold text-lg block mb-2">[!] SERVER OFFLINE</span>
              <p className="text-text-muted text-xs mb-4">Proxy daemon connection terminated.</p>
              <Button variant="secondary" onClick={() => globalThis.location.reload()}>
                RECONNECT
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

Sidebar.propTypes = {
  onClose: PropTypes.func,
};

function ManualUpdatePanel({ latestVersion, installCmd, copied, onCopyAndShutdown, onCancel, countdown, isDisconnected }) {
  const isCountingDown = countdown > 0;
  return (
    <div className="w-full max-w-lg border border-primary bg-surface p-5 text-text-main font-mono">
      <div className="flex items-center gap-2 mb-3 border-b border-border pb-2">
        <span className="text-primary font-bold">[UPDATE SEQUENCE]</span>
        <span className="text-text-muted text-xs">{latestVersion ? `v${latestVersion}` : ""}</span>
      </div>

      <p className="text-xs text-text-muted mb-2">
        {isDisconnected
          ? "Server stopped. Execute command in host terminal:"
          : isCountingDown
            ? `Command copied. Halting server in ${countdown}s...`
            : "Copy command and shut down server:"}
      </p>

      <div className="w-full p-2 border border-border bg-surface-2 mb-3">
        <code className="text-xs text-secondary break-all">$ {installCmd}</code>
      </div>

      {isDisconnected ? (
        <Button variant="secondary" fullWidth onClick={() => globalThis.location.reload()}>
          RELOAD INTERFACE
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={isCountingDown}>
            ABORT
          </Button>
          <Button variant="primary" onClick={onCopyAndShutdown} disabled={isCountingDown}>
            {copied ? "COPIED & HALTING..." : "COPY & SHUTDOWN"}
          </Button>
        </div>
      )}
    </div>
  );
}

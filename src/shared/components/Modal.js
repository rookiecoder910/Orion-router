"use client";

import { useEffect } from "react";
import { cn } from "@/shared/utils/cn";
import Button from "./Button";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlay = true,
  showTrafficLights = true,
  className,
}) {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-mono">
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-none"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Terminal Modal Window */}
      <div
        className={cn(
          "relative w-full bg-surface text-text-main",
          "border border-primary rounded-none shadow-none",
          sizes[size],
          className
        )}
      >
        {/* Terminal Window Header Bar */}
        {(title || showTrafficLights) && (
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface-2 text-xs select-none">
            <div className="flex items-center gap-2 min-w-0 truncate">
              <span className="text-primary font-bold">[+</span>
              {showTrafficLights && (
                <span className="text-text-muted hidden sm:inline">SYS://</span>
              )}
              {title && (
                <span className="font-bold text-primary uppercase tracking-wider truncate">
                  {title}
                </span>
              )}
              <span className="text-primary font-bold">+]</span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="px-1.5 py-0.5 text-xs font-bold text-danger hover:bg-danger hover:text-black border border-danger/40 transition-colors cursor-pointer"
            >
              [X]
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4 sm:p-6 max-h-[calc(85vh-100px)] overflow-y-auto custom-scrollbar text-xs sm:text-sm">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 p-3 sm:p-4 border-t border-border bg-surface-2/40">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "CONFIRM",
  cancelText = "CANCEL",
  variant = "danger",
  loading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} size="sm" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="space-y-2">
        <p className="text-text-main">{message}</p>
        <p className="text-[11px] text-text-muted">// Press [CONFIRM] to execute command.</p>
      </div>
    </Modal>
  );
}

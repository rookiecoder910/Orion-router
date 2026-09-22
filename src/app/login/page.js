"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@/shared/components";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetHint, setResetHint] = useState("");
  const [retryAfter, setRetryAfter] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasPassword, setHasPassword] = useState(null);
  const [authMode, setAuthMode] = useState("password");
  const [ssoType, setSsoType] = useState("oidc");
  const [oidcConfigured, setOidcConfigured] = useState(false);
  const [oidcLoginLabel, setOidcLoginLabel] = useState("Sign in with OIDC");
  const [samlConfigured, setSamlConfigured] = useState(false);
  const [samlLoginLabel, setSamlLoginLabel] = useState("Sign in with SAML SSO");
  const [mustChange, setMustChange] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Countdown for rate-limit
  useEffect(() => {
    if (retryAfter <= 0) return;
    const id = setInterval(() => setRetryAfter((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [retryAfter]);

  useEffect(() => {
    async function checkAuth() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

      try {
        const res = await fetch(`${baseUrl}/api/auth/status`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated === true || data.requireLogin === false) {
            window.location.assign("/dashboard");
            return;
          }
          setHasPassword(!!data.hasPassword);
          setAuthMode(data.authMode || "password");
          setSsoType(data.ssoType || "oidc");
          setOidcConfigured(data.oidcConfigured === true);
          setOidcLoginLabel(data.oidcLoginLabel || "Sign in with OIDC");
          setSamlConfigured(data.samlConfigured === true);
          setSamlLoginLabel(data.samlLoginLabel || "Sign in with SAML SSO");
        } else {
          setHasPassword(true);
        }
      } catch (err) {
        clearTimeout(timeoutId);
        setHasPassword(true);
      }
    }
    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResetHint("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.mustChangePassword) {
          setMustChange(true);
          return;
        }
        window.location.assign("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
        if (data.resetHint) setResetHint(data.resetHint);
        if (data.retryAfter) setRetryAfter(Number(data.retryAfter));
      }
    } catch (err) {
      setError("Connection failure. Retry request.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: password, newPassword }),
      });
      if (res.ok) {
        window.location.assign("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to update credentials");
      }
    } catch (err) {
      setError("Connection error encountered during key rotation.");
    } finally {
      setLoading(false);
    }
  };

  const handleOidcLogin = () => {
    window.location.href = "/api/auth/oidc/start";
  };

  const handleSamlLogin = () => {
    window.location.href = "/api/auth/saml/start";
  };

  const isSsoEnabled = ["sso", "oidc", "saml", "both"].includes(authMode);
  const activeSsoType = ssoType || (authMode === "saml" ? "saml" : "oidc");

  const samlAvailable = isSsoEnabled && activeSsoType === "saml" && samlConfigured;
  const oidcAvailable = isSsoEnabled && activeSsoType === "oidc" && oidcConfigured;
  const ssoAvailable = samlAvailable || oidcAvailable;

  const passwordAvailable = authMode === "password" || authMode === "both" || !ssoAvailable;

  if (hasPassword === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg p-4 font-mono text-primary">
        <div className="border border-primary p-6 max-w-sm w-full text-center">
          <div className="mb-2 animate-pulse">[ INITIALIZING SUBSYSTEMS... ]</div>
          <div className="text-xs text-text-muted">// PROBING SECURITY CONTEXT</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4 relative font-mono text-text-main overflow-hidden select-none">
      {/* CRT Scanline Overlay */}
      <div className="crt-overlay pointer-events-none fixed inset-0 z-40" aria-hidden="true" />

      {/* Background terminal grid */}
      <div className="landing-grid absolute inset-0 pointer-events-none opacity-50" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Terminal Header & ASCII Art */}
        <div className="mb-4 text-center flex flex-col items-center">
          <img src="/logo.png" alt="OrionRouter" className="size-12 object-contain mb-3" />
          <pre className="text-[10px] sm:text-xs leading-[11px] sm:leading-[13px] text-primary terminal-glow inline-block whitespace-pre font-mono">
{`  ___  ____  ___ ___  _   _ 
 / _ \\|  _ \\|_ _/ _ \\| \\ | |
| | | | |_) || | | | |  \\| |
| |_| |  _ < | | |_| | |\\  |
 \\___/|_| \\_\\___\\___/|_| \\_|`}
          </pre>
          <div className="mt-2 text-xs uppercase tracking-widest text-text-muted">
            ======================================
          </div>
          <div className="text-xs text-primary font-bold uppercase tracking-widest mt-1">
            ORIONROUTER // ACCESS CONTROL REQUIRED
          </div>
        </div>

        {/* Terminal Authentication Window */}
        <div className="border border-primary bg-surface p-0 shadow-none">
          {/* Window Title Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-surface-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">[TTY: 0]</span>
              <span className="text-text-muted">root@orionrouter:~/auth</span>
            </div>
            <span className="text-primary animate-pulse text-[11px]">[SECURE]</span>
          </div>

          <div className="p-5 sm:p-6 flex flex-col gap-4">
            {mustChange ? (
              <form onSubmit={handleSetNewPassword} className="flex flex-col gap-4">
                <div className="p-2 border border-warning bg-warning/10 text-warning text-xs">
                  [!] MANDATORY CREDENTIAL ROTATION: Remote access requires non-default password.
                </div>
                <Input
                  label="NEW ACCESS KEY"
                  type="password"
                  placeholder="Enter new master password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoFocus
                />
                {error && (
                  <div className="p-2 border border-danger bg-danger/10 text-danger text-xs">
                    [ERR] {error}
                  </div>
                )}
                <Button type="submit" variant="primary" loading={loading} disabled={!newPassword}>
                  EXECUTE ROTATION
                </Button>
              </form>
            ) : (
              <div className="flex flex-col gap-4">
                {samlAvailable && (
                  <Button type="button" variant="primary" onClick={handleSamlLogin}>
                    {samlLoginLabel}
                  </Button>
                )}

                {oidcAvailable && (
                  <Button type="button" variant="primary" onClick={handleOidcLogin}>
                    {oidcLoginLabel}
                  </Button>
                )}

                {ssoAvailable && passwordAvailable && (
                  <div className="text-center text-xs text-text-subtle select-none">
                    -------------- OR --------------
                  </div>
                )}

                {passwordAvailable && (
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    {isSsoEnabled && !ssoAvailable && (
                      <div className="p-2 border border-warning bg-warning/10 text-warning text-xs">
                        [!] SSO configuration incomplete. Fallback to password authentication.
                      </div>
                    )}

                    <div className="flex flex-col gap-2">
                      <Input
                        label="ACCESS KEY / PASSWORD"
                        type="password"
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoFocus={!oidcAvailable}
                      />

                      {error && (
                        <div className="p-2 border border-danger bg-danger/10 text-danger text-xs font-bold">
                          [!] ACCESS DENIED: {error}
                        </div>
                      )}

                      {retryAfter > 0 && (
                        <div className="p-2 border border-warning bg-warning/10 text-warning text-xs font-bold">
                          [!] LOCKOUT ACTIVE: RETRY IN {retryAfter}s
                        </div>
                      )}

                      {resetHint && (
                        <div className="text-xs text-text-muted mt-1">
                          // RECOVERY: Run host CLI <code className="text-primary">$ orionrouter</code> &rarr; Settings &rarr; Reset Password.
                        </div>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      disabled={retryAfter > 0}
                    >
                      {retryAfter > 0 ? `LOCKED (${retryAfter}s)` : "AUTHENTICATE"}
                    </Button>

                    <div className="border-t border-border/50 pt-3 text-[11px] text-text-muted flex items-center justify-between">
                      <span>// DEFAULT_PASSWORD:</span>
                      <code className="text-primary font-bold">123456</code>
                    </div>

                    {hasPassword === false && (
                      <div className="p-2 border border-secondary bg-secondary/10 text-secondary text-xs">
                        [WARN] Unprotected instance. Set password before opening public tunnel.
                      </div>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Terminal footer status */}
        <div className="mt-4 text-center text-[11px] text-text-subtle">
          <span>ORIONROUTER TERMINAL INTERFACE // ALL SESSIONS LOGGED</span>
        </div>
      </div>
    </div>
  );
}

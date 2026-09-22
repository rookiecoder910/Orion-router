"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import PropTypes from "prop-types";
import ProviderIcon from "@/shared/components/ProviderIcon";
import HeaderMenu from "@/shared/components/HeaderMenu";
import HeaderLanguage from "@/shared/components/HeaderLanguage";
import DonateModal from "@/shared/components/DonateModal";
import { useHeaderSearchStore } from "@/store/headerSearchStore";
import { OAUTH_PROVIDERS, APIKEY_PROVIDERS } from "@/shared/constants/config";
import { MEDIA_PROVIDER_KINDS, AI_PROVIDERS } from "@/shared/constants/providers";
import { getProviderIconSrc } from "@/shared/utils/providerIcon";
import { translate } from "@/i18n/runtime";

const getPageInfo = (pathname) => {
  if (!pathname) return { title: "", description: "", breadcrumbs: [] };

  // Media provider detail: /dashboard/media-providers/[kind]/[id]
  const mediaDetailMatch = pathname.match(/\/media-providers\/([^/]+)\/([^/]+)$/);
  if (mediaDetailMatch) {
    const kindId = mediaDetailMatch[1];
    const providerId = mediaDetailMatch[2];
    const kindConfig = MEDIA_PROVIDER_KINDS.find((k) => k.id === kindId);
    const provider = AI_PROVIDERS[providerId];
    return {
      title: provider?.name || providerId,
      description: "",
      breadcrumbs: [
        { label: "media", href: `/dashboard/media-providers/${kindId}` },
        { label: kindConfig?.label || kindId, href: `/dashboard/media-providers/${kindId}` },
        { label: provider?.name || providerId, image: getProviderIconSrc(providerId) },
      ],
    };
  }

  // Media provider kind: /dashboard/media-providers/[kind]
  const mediaKindMatch = pathname.match(/\/media-providers\/([^/]+)$/);
  if (mediaKindMatch) {
    const kindId = mediaKindMatch[1];
    const kindConfig = MEDIA_PROVIDER_KINDS.find((k) => k.id === kindId);
    return {
      title: kindConfig?.label || kindId,
      description: `Manage your ${kindConfig?.label || kindId} providers`,
      icon: kindConfig?.icon || "perm_media",
      breadcrumbs: [],
    };
  }

  // Provider detail page: /dashboard/providers/[id]
  const providerMatch = pathname.match(/\/providers\/([^/]+)$/);
  if (providerMatch) {
    const providerId = providerMatch[1];
    const providerInfo =
      OAUTH_PROVIDERS[providerId] || APIKEY_PROVIDERS[providerId];
    if (providerInfo) {
      return {
        title: providerInfo.name,
        description: "",
        breadcrumbs: [
          { label: "providers", href: "/dashboard/providers" },
          {
            label: providerInfo.name,
            image: getProviderIconSrc(providerInfo.id),
          },
        ],
      };
    }
  }

  if (pathname.includes("/providers") && !pathname.includes("/media-providers"))
    return {
      title: "PROVIDERS",
      description: "Manage AI provider connections & fallbacks",
      icon: "dns",
      breadcrumbs: [],
    };
  if (pathname.includes("/combos"))
    return {
      title: "COMBOS",
      description: "Model combo cascades with auto-fallback",
      icon: "layers",
      breadcrumbs: [],
    };
  if (pathname.includes("/usage"))
    return {
      title: "USAGE & ANALYTICS",
      description: "Token metrics, request logs & latency",
      icon: "bar_chart",
      breadcrumbs: [],
    };
  if (pathname.includes("/quota"))
    return {
      title: "QUOTA TRACKER",
      description: "Tier limits, reset schedules & usage burn",
      icon: "data_usage",
      breadcrumbs: [],
    };
  if (pathname.includes("/token-saver"))
    return {
      title: "TOKEN SAVER",
      description: "RTK token compressor & compression stats",
      icon: "savings",
      breadcrumbs: [],
    };
  if (pathname.includes("/cli-tools"))
    return {
      title: "CLI TOOLS",
      description: "Claude Code, Codex, Cursor, Cline setup",
      icon: "terminal",
      breadcrumbs: [],
    };
  if (pathname.includes("/proxy-pools"))
    return {
      title: "PROXY POOLS",
      description: "Outbound proxy clusters & rotation",
      icon: "lan",
      breadcrumbs: [],
    };
  if (pathname.includes("/skills"))
    return {
      title: "SKILLS",
      description: "Agent execution tools & capabilities",
      icon: "extension",
      breadcrumbs: [],
    };
  if (pathname.includes("/profile"))
    return {
      title: "SYSTEM CONFIG",
      description: "Security, database, tunnels, and auth settings",
      icon: "settings",
      breadcrumbs: [],
    };
  if (pathname.includes("/endpoint") || pathname === "/dashboard")
    return {
      title: "ENDPOINT & KEY",
      description: "OpenAI-compatible router endpoint & key registry",
      icon: "api",
      breadcrumbs: [],
    };

  return { title: "ORIONROUTER", description: "", breadcrumbs: [] };
};

export default function Header({ onMenuClick, showMenuButton = true }) {
  const pathname = usePathname();
  const pageInfo = useMemo(() => getPageInfo(pathname), [pathname]);
  const [donateOpen, setDonateOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [loginMethod, setLoginMethod] = useState("");

  const { title, description, icon, breadcrumbs } = pageInfo;

  useEffect(() => {
    let cancelled = false;

    async function loadAuthStatus() {
      try {
        const res = await fetch("/api/auth/status", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setDisplayName(data?.displayName || data?.samlName || data?.samlEmail || data?.oidcName || data?.oidcEmail || "");
          setLoginMethod(data?.loginMethod || "");
        }
      } catch {
        if (!cancelled) {
          setDisplayName("");
          setLoginMethod("");
        }
      }
    }

    loadAuthStatus();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.assign("/login");
      }
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <header className="shrink-0 flex items-center justify-between gap-3 px-4 lg:px-6 py-2.5 border-b border-border bg-surface font-mono z-20 select-none">
      {/* Mobile menu button */}
      <div className="flex items-center gap-2 lg:hidden shrink-0">
        {showMenuButton && (
          <button
            onClick={onMenuClick}
            className="px-2 py-1 text-xs border border-border text-primary hover:bg-primary hover:text-black cursor-pointer"
          >
            [MENU]
          </button>
        )}
      </div>

      {/* Terminal shell prompt line */}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs truncate">
          <span className="text-primary font-bold">root@orionrouter:~$</span>
          {breadcrumbs.length > 0 ? (
            <div className="flex items-center gap-1.5 truncate">
              {breadcrumbs.map((crumb, index) => (
                <div key={`${crumb.label}-${crumb.href || "current"}`} className="flex items-center gap-1.5">
                  {index > 0 && <span className="text-text-muted select-none">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="text-text-muted hover:text-primary transition-none">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-primary font-bold">{translate(crumb.label)}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="text-text-muted">
              cat /proc/<span className="text-primary font-bold">{title?.toLowerCase().replace(/\s+/g, "-") || "sys"}</span>
            </span>
          )}
          <span className="text-primary animate-terminal-blink select-none">█</span>
        </div>

        {description && (
          <p className="hidden lg:block text-[11px] text-text-muted mt-0.5 truncate">
            // {translate(description)}
          </p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 shrink-0 text-xs">
        {displayName && (loginMethod === "OIDC" || loginMethod === "SAML") && (
          <div
            className="hidden sm:flex items-center gap-1.5 px-2 py-1 border border-border bg-surface-2 text-text-muted text-[11px]"
            title={displayName}
          >
            <span className="text-primary font-bold">[{loginMethod}]</span>
            <span className="truncate max-w-[120px]">{displayName}</span>
          </div>
        )}

        <HeaderSearch />

        <button
          onClick={() => setDonateOpen(true)}
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 border border-secondary text-secondary hover:bg-secondary hover:text-black font-bold text-xs uppercase transition-none cursor-pointer"
          aria-label="Donate"
        >
          <span>[♥ DONATE]</span>
        </button>

        <HeaderLanguage />
        <HeaderMenu onLogout={handleLogout} />
      </div>

      <DonateModal isOpen={donateOpen} onClose={() => setDonateOpen(false)} />
    </header>
  );
}

function HeaderSearch() {
  const visible = useHeaderSearchStore((s) => s.visible);
  const query = useHeaderSearchStore((s) => s.query);
  const placeholder = useHeaderSearchStore((s) => s.placeholder);
  const setQuery = useHeaderSearchStore((s) => s.setQuery);

  if (!visible) return null;

  return (
    <div className="relative w-[150px] sm:w-[200px] font-mono">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`grep: ${placeholder || "..."}`}
        className="w-full h-7 pl-2 pr-6 border border-border bg-surface text-xs text-primary font-mono placeholder:text-text-subtle focus:outline-none focus:border-primary rounded-none"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-danger hover:text-danger/80 px-1 text-[11px] font-bold"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

Header.propTypes = {
  onMenuClick: PropTypes.func,
  showMenuButton: PropTypes.bool,
};

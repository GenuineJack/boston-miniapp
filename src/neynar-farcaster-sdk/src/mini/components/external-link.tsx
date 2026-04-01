"use client";

import sdk from "@farcaster/miniapp-sdk";
import { AnchorHTMLAttributes, MouseEvent, useCallback } from "react";

/**
 * Opens a URL using the Farcaster miniapp SDK so it launches
 * in the system browser instead of navigating the webview.
 */
export async function openExternalUrl(url: string) {
  try {
    await sdk.actions.openUrl(url);
  } catch {
    // Fallback for non-Farcaster contexts (dev, browser)
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

/**
 * Drop-in replacement for `<a target="_blank">` that uses the Farcaster
 * miniapp SDK to open URLs in the system browser, keeping the mini-app
 * loaded in the background.
 *
 * Falls back to normal `target="_blank"` behavior in non-Farcaster contexts.
 */
export function ExternalLink({ onClick, href, ...rest }: ExternalLinkProps) {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || !href) return;
      e.preventDefault();
      openExternalUrl(href);
    },
    [onClick, href],
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      {...rest}
    />
  );
}

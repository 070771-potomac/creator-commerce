import * as React from "react";
// Phosphor (regular weight), matching components.json → iconLibrary: "phosphor".
const CDN = "https://unpkg.com/@phosphor-icons/core@2.1.1/assets/regular/";
// Names used across this system were written for Lucide; map them to Phosphor.
// Names that already exist in Phosphor (check, x, heart, package…) pass through.
const ALIAS = {
  "layout-dashboard": "squares-four", download: "download-simple", settings: "gear", "circle-help": "question",
  upload: "upload-simple", sparkles: "sparkle", ellipsis: "dots-three", "more-horizontal": "dots-three",
  search: "magnifying-glass", lock: "lock-key", store: "storefront", "file-archive": "file-zip", music: "music-note",
  "file-json": "file-code", "external-link": "arrow-square-out", "refresh-cw": "arrows-clockwise",
  "panel-left": "sidebar-simple", "log-out": "sign-out", "trash-2": "trash", "chevron-down": "caret-down",
  "chevron-up": "caret-up", "chevron-right": "caret-right", "chevron-left": "caret-left", "circle-check": "check-circle",
  "circle-alert": "warning-circle", "alert-circle": "warning-circle", "triangle-alert": "warning", "circle-x": "x-circle",
  mail: "envelope", menu: "list",
};
export function Icon({ name, size = 16, color = "currentColor", style, ...rest }) {
  const url = "url(" + CDN + (ALIAS[name] || name) + ".svg)";
  return <span aria-hidden="true" {...rest} style={{ display: "inline-block", flexShrink: 0, width: size, height: size, background: color,
    WebkitMask: url + " center / contain no-repeat", mask: url + " center / contain no-repeat", ...style }} />;
}

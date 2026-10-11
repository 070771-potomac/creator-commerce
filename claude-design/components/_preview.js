// Preview loader for cards + UI kits. Uses the compiled _ds_bundle.js when present,
// otherwise transpiles the component sources directly (requires React + Babel globals).
(function () {
  const FILES = ["core/Icon", "core/Button", "core/Badge", "core/Separator", "core/Skeleton", "core/Tooltip", "core/Avatar",
    "forms/Input", "forms/Textarea", "forms/Select", "forms/Label", "forms/Checkbox", "forms/Switch",
    "layout/Card", "layout/Sheet", "layout/Dialog", "navigation/Sidebar", "navigation/NavigationMenu",
    "data/Table", "feedback/Toast", "feedback/EmptyState"];
  function findNS() {
    for (const k of Object.keys(window)) {
      try { const v = window[k]; if (v && typeof v === "object" && v.Button && v.Card && v.Table && v.Sidebar) return v; } catch (e) {}
    }
    return null;
  }
  function tryBundle(root) {
    return new Promise(res => {
      const s = document.createElement("script");
      s.src = root + "_ds_bundle.js";
      s.onload = () => res(findNS());
      s.onerror = () => { s.remove(); res(null); };
      document.head.appendChild(s);
    });
  }
  async function fromSource(root) {
    const ns = {};
    for (const f of FILES) {
      let src = await (await fetch(root + "components/" + f + ".jsx")).text();
      const names = [...src.matchAll(/export function (\w+)/g)].map(m => m[1]);
      src = src.replace(/^import .*$/gm, "").replace(/export function/g, "function");
      const code = Babel.transform(src, { presets: ["react"] }).code;
      const keys = Object.keys(ns);
      const fn = new Function("React", ...keys, code + "\nreturn {" + names.join(",") + "};");
      Object.assign(ns, fn(React, ...keys.map(k => ns[k])));
    }
    return ns;
  }
  window.loadDS = async function (root) {
    try { return findNS() || (await tryBundle(root)) || (await fromSource(root)); }
    catch (e) { console.error("loadDS failed:", e); throw e; }
  };
})();

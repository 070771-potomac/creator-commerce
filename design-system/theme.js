// Shared light/dark toggle for all preview pages.
(function () {
  var KEY = "cc-ds-theme";
  function apply(t) {
    document.documentElement.classList.toggle("dark", t === "dark");
    var b = document.getElementById("theme-toggle");
    if (b) b.textContent = t === "dark" ? "☀ Light" : "☾ Dark";
  }
  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(saved || "light");
  window.addEventListener("DOMContentLoaded", function () {
    var b = document.getElementById("theme-toggle");
    if (!b) return;
    apply(document.documentElement.classList.contains("dark") ? "dark" : "light");
    b.addEventListener("click", function () {
      var next = document.documentElement.classList.contains("dark") ? "light" : "dark";
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
  });
})();

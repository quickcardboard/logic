// Installable app: register the service worker, and wire the "landscape, full screen" button for phones.
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));

(() => {
  const btn = document.getElementById("rotateBtn");
  if (!btn) return;
  const toast = msg => {
    const t = document.getElementById("toast"); if (!t) return;
    t.textContent = msg; t.className = "toast show"; clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2600);
  };
  btn.onclick = async () => {
    try {
      if (document.fullscreenElement) {   // second tap: back to normal
        screen.orientation?.unlock?.(); await document.exitFullscreen(); return;
      }
      await document.documentElement.requestFullscreen({ navigationUI: "hide" });
      await screen.orientation.lock("landscape");
    } catch {
      toast("Turn your phone sideways to read in landscape.");
    }
  };
  const sync = () => btn.classList.toggle("on", !!document.fullscreenElement);
  document.addEventListener("fullscreenchange", sync);
})();

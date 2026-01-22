(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
document.querySelectorAll(".side-nav__toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const item = toggle.closest(".side-nav__item");
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    item.classList.toggle("is-open", !expanded);
  });
});
const sideNav = document.querySelector(".side-nav");
window.addEventListener("scroll", () => {
  if (window.scrollY > 120) {
    sideNav.classList.add("is-stuck");
  } else {
    sideNav.classList.remove("is-stuck");
  }
});
io.observe(sentinel);
document.addEventListener("DOMContentLoaded", () => {
  function openModal(id) {
    document.getElementById(id).classList.add("active");
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove("active");
  }
  window.openModal = openModal;
  window.closeModal = closeModal;
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach((modal) => {
        modal.classList.remove("active");
      });
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab--container").forEach(initTabGroup);
});
function initTabGroup(groupEl) {
  const tabs = groupEl.querySelectorAll(".tab--item");
  const panels = groupEl.querySelectorAll(".tab--panel");
  groupEl.addEventListener("click", (e) => {
    const tab = e.target.closest(".tab--item");
    if (!tab || !groupEl.contains(tab)) return;
    const targetId = tab.getAttribute("data-tab");
    if (!targetId) return;
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === targetId);
    });
  });
}
document.addEventListener("DOMContentLoaded", function() {
  const toggles = document.querySelectorAll("[data-toggle]");
  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const group = toggle.dataset.group;
      if (group) {
        document.querySelectorAll(`[data-group="${group}"]`).forEach((el) => {
          el.classList.remove("active");
        });
        toggle.classList.add("active");
      } else {
        toggle.classList.toggle("active");
      }
    });
  });
});
const accItems = document.querySelectorAll(".acc-item");
accItems.forEach((item) => {
  const btn = item.querySelector(".acc-btn");
  const panel = item.querySelector(".acc-panel");
  btn.addEventListener("click", () => {
    const isActive = item.classList.contains("is-active");
    accItems.forEach((other) => {
      if (other !== item) {
        other.classList.remove("is-active");
        const otherPanel = other.querySelector(".acc-panel");
        otherPanel.style.height = 0;
      }
    });
    if (isActive) {
      item.classList.remove("is-active");
      panel.style.height = 0;
    } else {
      item.classList.add("is-active");
      panel.style.height = panel.scrollHeight + "px";
    }
  });
});
const drake = dragula(
  [document.getElementById("dragArea")],
  {
    mirrorContainer: document.body
  }
);
drake.on("cloned", function(clone, original, type) {
  if (type === "mirror") {
    clone.innerHTML = "";
    clone.innerHTML = `
      <div class="ghost-drag-item">
        이동 중.
      </div>
    `;
    clone.classList.add("ghost-wrapper");
  }
});
const listheads = document.querySelectorAll(".listhead");
const listbodies = document.querySelectorAll(".listbody");
listheads.forEach((head, i) => {
  const body = listbodies[i];
  if (!body) return;
  const headSpans = head.querySelectorAll("span");
  const widths = Array.from(headSpans).map(
    (span) => span.style.width || window.getComputedStyle(span).width
  );
  const gridTemplate = widths.join(" ");
  const rows = body.querySelectorAll(".board li");
  rows.forEach((row) => {
    row.style.display = "grid";
    row.style.gridTemplateColumns = gridTemplate;
  });
});

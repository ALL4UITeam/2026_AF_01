import "/scss/main.scss";

// sideNav
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
  sideNav.classList.toggle("is-stuck", window.scrollY > 120);
});

//Modal
document.addEventListener("DOMContentLoaded", () => {
  function openModal(id) {
    document.getElementById(id).classList.add("active");
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove("active");
  }

  window.openModal = openModal;
  window.closeModal = closeModal;

  // form 모달이 많아 불편해서 제거
  // 배경 클릭 시 닫기
  // document.addEventListener("click", function(e) {
  //   if (e.target.classList.contains("modal")) {
  //     e.target.classList.remove("active");
  //   }
  // });

  // ESC 키로 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach((modal) => {
        modal.classList.remove("active");
      });
    }
  });
});

// Tab
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

// Toggle
document.addEventListener("DOMContentLoaded", function () {
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

//accordion
const accItems = document.querySelectorAll(".acc-item");

accItems.forEach((item) => {
  const btn = item.querySelector(".acc-btn");
  const panel = item.querySelector(".acc-panel");

  btn.addEventListener("click", () => {
    const isActive = item.classList.contains("is-active");

    // 다른 항목 닫기
    accItems.forEach((other) => {
      if (other !== item) {
        other.classList.remove("is-active");
        const otherPanel = other.querySelector(".acc-panel");
        otherPanel.style.height = 0;
      }
    });

    // 현재 항목 토글
    if (isActive) {
      // 닫기
      item.classList.remove("is-active");
      panel.style.height = 0;
    } else {
      // 열기
      item.classList.add("is-active");
      panel.style.height = panel.scrollHeight + "px"; // 실제 내용 높이 계산
    }
  });
});

const drake = dragula([document.getElementById("dragArea")], {
  mirrorContainer: document.body,
});

drake.on("cloned", function (clone, original, type) {
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

// 테이블화 - 스크롤 대응
const listheads = document.querySelectorAll(".listhead");
const listbodies = document.querySelectorAll(".listbody");

listheads.forEach((head, i) => {
  const body = listbodies[i];

  if (!body) return;

  const headSpans = head.querySelectorAll("span");
  const widths = Array.from(headSpans).map(
    (span) => span.style.width || window.getComputedStyle(span).width,
  );

  const gridTemplate = widths.join(" ");

  const rows = body.querySelectorAll(".board li");

  rows.forEach((row) => {
    row.style.display = "grid";
    row.style.gridTemplateColumns = gridTemplate;
  });
});

$(".date-picker").datetimepicker({
  format: "Y-m-d",
  timepicker: false,
  lang: "ko",
});

$(document).ready(function () {
  // table-scroll의 헤더와 본문 셀 너비 동기화 (컬럼 수 동적 처리)
  // table-scroll 클래스가 있어야만 기능이 작동함
  function syncTableColumnWidths() {
    $(".table-scroll").each(function () {
      var $table = $(this);
      // 기능 클래스 기준으로 찾기
      var $headerRow = $table.find(".table-header .table-cell__row");
      var $bodyRows = $table.find(".table-body .table-cell__row");

      if ($headerRow.length === 0 || $bodyRows.length === 0) return;

      // 헤더의 셀 개수를 동적으로 감지
      var $headerCells = $headerRow.find(".table-cell");
      var columnCount = $headerCells.length;

      if (columnCount === 0) return;

      // 1단계: 먼저 CSS 변수로 컬럼 수 설정 (초기 렌더링을 위해)
      $table.css("--column-count", columnCount);

      // 2단계: 잠시 대기 후 실제 너비 측정 (렌더링 완료 후)
      setTimeout(function () {
        // 부모 컨테이너의 실제 너비 확인
        var tableWidth = $table.width();
        if (tableWidth === 0) return; // 아직 렌더링되지 않음

        // 각 셀의 실제 너비 측정 (getBoundingClientRect 사용)
        var columnWidths = [];
        $headerCells.each(function () {
          var cellWidth = this.getBoundingClientRect().width;
          columnWidths.push(cellWidth);
        });

        // 전체 너비가 합리적인 범위인지 확인 (부모 너비의 0.5~2배)
        var totalWidth = columnWidths.reduce(function (sum, width) {
          return sum + width;
        }, 0);

        // 너비가 비정상적으로 크면 부모 너비를 기준으로 재계산
        if (totalWidth > tableWidth * 2 || totalWidth < tableWidth * 0.5) {
          // 부모 너비를 컬럼 수로 나눠서 균등 분배
          var avgWidth = tableWidth / columnCount;
          columnWidths = [];
          for (var i = 0; i < columnCount; i++) {
            columnWidths.push(avgWidth);
          }
        }

        // 측정한 너비를 grid-template-columns로 변환
        var gridTemplateColumns = columnWidths
          .map(function (width) {
            return width + "px";
          })
          .join(" ");

        // 헤더와 본문의 모든 행에 동일한 grid-template-columns 적용
        $headerRow.css("grid-template-columns", gridTemplateColumns);
        $bodyRows.css("grid-template-columns", gridTemplateColumns);
      }, 50);
    });
  }

  // 페이지 로드 시 실행 (약간의 지연을 두어 DOM이 완전히 렌더링된 후)
  setTimeout(function () {
    syncTableColumnWidths();
  }, 200);

  // 윈도우 리사이즈 시에도 동기화
  var resizeTimer;
  $(window).on("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      syncTableColumnWidths();
    }, 150);
  });
});

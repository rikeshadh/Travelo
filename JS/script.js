document.addEventListener("DOMContentLoaded", function () {
  // =========================
  // Calendar: Check-in & Check-out
  // =========================
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");

  let checkoutPicker = null;

  const checkinPicker = flatpickr(checkinInput, {
    minDate: "today",
    dateFormat: "M j, Y",
    onOpen: () => setTimeout(() => {
      checkinInput._flatpickr.calendarContainer.style.width = "auto";
    }, 100),
    onChange: function (selectedDates) {
      if (selectedDates.length > 0) {
        const minCheckoutDate = new Date(selectedDates[0]);
        minCheckoutDate.setDate(minCheckoutDate.getDate() + 1);
        checkoutPicker.set("minDate", minCheckoutDate);
        checkoutPicker.clear();
        setTimeout(() => checkoutPicker.open(), 200);
      }
    }
  });

  checkoutPicker = flatpickr(checkoutInput, {
    minDate: "today",
    dateFormat: "M j, Y",
    onOpen: () => setTimeout(() => {
      checkoutInput._flatpickr.calendarContainer.style.width = "auto";
    }, 100)
  });

  // =========================
  // Guest Dropdown
  // =========================
  const guestFields = document.querySelectorAll("#guest-field, #mini-guests");
  const guestDropdown = document.getElementById("guest-dropdown");
  const guestInput = document.getElementById("guests");
  const doneBtn = document.getElementById("done-btn");
  const petsCheckbox = document.getElementById("pets");
  const counts = { adults: 2, children: 0 };

  guestFields.forEach(field => {
    field.addEventListener("click", e => {
      e.stopPropagation();
      guestDropdown.classList.toggle("hidden");
    });
  });

  guestDropdown.addEventListener("click", e => e.stopPropagation());

  document.addEventListener("click", e => {
    if (!guestDropdown.contains(e.target)) {
      guestDropdown.classList.add("hidden");
    }
  });

  document.querySelectorAll(".plus, .minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const countEl = document.getElementById(`${type}-count`);
      if (btn.classList.contains("plus")) {
        counts[type]++;
      } else if (counts[type] > 0) {
        counts[type]--;
      }
      countEl.textContent = counts[type];
    });
  });

  doneBtn.addEventListener("click", () => {
    const pets = petsCheckbox.checked;
    let summary = `${counts.adults} adults · ${counts.children} children`;
    if (pets) summary += " · pets";
    guestInput.value = summary;
    guestDropdown.classList.add("hidden");
  });

  // =========================
  // Clear All
  // =========================
  document.getElementById("clear-all-btn").addEventListener("click", () => {
    counts.adults = 0;
    counts.children = 0;
    petsCheckbox.checked = false;
    document.getElementById("adults-count").textContent = 0;
    document.getElementById("children-count").textContent = 0;
    guestInput.value = "";
  });

  // =========================
  // Hamburger Menu Dropdown
  // =========================
  const hamburger = document.getElementById("hamburger-menu");
  const menuDropdown = document.getElementById("menu-dropdown");

  hamburger.addEventListener("click", e => {
    e.stopPropagation();
    menuDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    menuDropdown.classList.add("hidden");
  });

  menuDropdown.addEventListener("click", e => e.stopPropagation());

  // =========================
  // Scroll Behavior: Mini Search Bar
  // =========================
  const largeSearch = document.querySelector(".searchBar-container");
  const miniSearch = document.getElementById("mini-search-bar");

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 120;
    largeSearch.classList.toggle("hidden", scrolled);
    miniSearch.classList.toggle("visible", scrolled);
  });

  // =========================
  // Mini Search Bar Interaction
  // =========================
  document.getElementById("mini-where").addEventListener("click", () => expandFullSearch("where"));
  document.getElementById("mini-date").addEventListener("click", () => expandFullSearch("date"));
  document.getElementById("mini-guests").addEventListener("click", () => expandFullSearch("guests"));

  function expandFullSearch(focusTarget) {
    const heroOffset = document.getElementById("hero").offsetTop;
    window.scrollTo({ top: heroOffset, behavior: "smooth" });

    setTimeout(() => {
      switch (focusTarget) {
        case "where":
          document.getElementById("destination").focus();
          break;
        case "date":
          checkinInput._flatpickr.open();
          break;
        case "guests":
          guestDropdown.classList.remove("hidden");
          break;
      }
    }, 200);
  }

  // =========================
  // Sign Up & Login Modal
  // =========================
  const loginBtn = document.getElementById("login-signup-btn");
  const modal = document.getElementById("signup-modal");

  if (loginBtn && modal) {
    const closeBtn = modal.querySelector(".signup-close-btn");

    loginBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    closeBtn?.addEventListener("click", () => {
      modal.style.display = "none";
    });

    window.addEventListener("click", e => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        modal.style.display = "none";
      }
    });
  }

  // =========================
  // Trending Section
  // =========================

  const carousel = document.getElementById("cardCarousel");
  const origCards = Array.from(carousel.querySelectorAll(".trending-card"));
  const leftBtn = document.querySelector(".carousel-arrow.left");
  const rightBtn = document.querySelector(".carousel-arrow.right");

  let totalCards = origCards.length;
  let cardWidth = 0;
  let gap = 16;
  let currentIndex = 0;
  const sets = 5; // number of repeated sets (odd is easiest)
  let middleOffset = totalCards * Math.floor(sets / 2);

  // helper to compute offset that centers a card in the visible area
  function getCenterOffset(firstCardEl) {
    const visibleWidth = carousel.clientWidth;
    const cardW = firstCardEl.offsetWidth;
    return (visibleWidth - cardW) / 2;
  }

  function setupCarousel() {
    // clear & build repeated sets
    carousel.innerHTML = "";
    const all = [];
    for (let i = 0; i < sets; i++) {
      origCards.forEach(c => all.push(c.cloneNode(true)));
    }
    all.forEach(c => carousel.appendChild(c));

    // compute actual gap (fallback to 16px)
    const computedGap = getComputedStyle(carousel).gap;
    gap = computedGap ? parseFloat(computedGap) || 16 : 16;

    // compute card width based on an appended clone
    const firstCard = carousel.querySelector(".trending-card");
    if (!firstCard) return;
    cardWidth = firstCard.offsetWidth + gap;

    // start in the middle set so we can scroll freely both ways
    currentIndex = totalCards * Math.floor(sets / 2); // e.g., sets=5 -> start at 2*totalCards
    const offset = getCenterOffset(firstCard);

    // position without smooth animation
    carousel.style.scrollBehavior = "auto";
    carousel.scrollLeft = currentIndex * cardWidth - offset;
    carousel.style.scrollBehavior = "smooth";

    updateFocus();
  }

  // set focused class on the centered card
  function updateFocus() {
    const all = Array.from(carousel.querySelectorAll(".trending-card"));
    all.forEach(c => c.classList.remove("focused"));
    const target = all[currentIndex];
    if (target) target.classList.add("focused");
  }

  function scrollToIndex(index) {
    currentIndex = index;
    const firstCard = carousel.querySelector(".trending-card");
    if (!firstCard) return;
    const offset = getCenterOffset(firstCard);
    carousel.scrollTo({ left: currentIndex * cardWidth - offset, behavior: "smooth" });
    updateFocus();
  }

  // invisible reset when we wander too close to ends
  function checkInfiniteLoop() {
    const minIndex = totalCards;                // avoid the very first set
    const maxIndex = totalCards * (sets - 1);   // avoid the very last set
    const firstCard = carousel.querySelector(".trending-card");
    if (!firstCard) return;
    const offset = getCenterOffset(firstCard);

    if (currentIndex < minIndex) {
      // map index into the middle region (add middleOffset)
      currentIndex += middleOffset;
      carousel.style.scrollBehavior = "auto";
      carousel.scrollLeft = currentIndex * cardWidth - offset;
      carousel.style.scrollBehavior = "smooth";
    } else if (currentIndex >= maxIndex) {
      currentIndex -= middleOffset;
      carousel.style.scrollBehavior = "auto";
      carousel.scrollLeft = currentIndex * cardWidth - offset;
      carousel.style.scrollBehavior = "smooth";
    }
  }

  // arrow handlers
  leftBtn?.addEventListener("click", () => {
    currentIndex--;
    scrollToIndex(currentIndex);
    setTimeout(checkInfiniteLoop, 360);
  });

  rightBtn?.addEventListener("click", () => {
    currentIndex++;
    scrollToIndex(currentIndex);
    setTimeout(checkInfiniteLoop, 360);
  });

  // if user drags/scrolls manually, track currentIndex and fix looping (debounced)
  let scrollTimeout = null;
  carousel.addEventListener("scroll", () => {
    const firstCard = carousel.querySelector(".trending-card");
    if (!firstCard) return;
    const offset = getCenterOffset(firstCard);

    // compute nearest index from scrollLeft
    const approxIndex = Math.round((carousel.scrollLeft + offset) / cardWidth);
    if (approxIndex !== currentIndex) {
      currentIndex = approxIndex;
      updateFocus();
    }

    // debounce the loop check so it runs when scroll stops
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      checkInfiniteLoop();
    }, 150);
  });

  window.addEventListener("resize", () => {
    // rebuild so sizes & centering are recalculated
    setupCarousel();
  });

  // initial setup
  setupCarousel();



});
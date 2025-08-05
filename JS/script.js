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
  // Trending Section Carousel
  // =========================
  const carousel = document.getElementById("cardCarousel");
  const cards = carousel?.querySelectorAll(".trending-card") || [];
  const leftBtn = document.querySelector(".carousel-arrow.left");
  const rightBtn = document.querySelector(".carousel-arrow.right");

  let currentIndex = 0;
  const cardWidth = cards[0]?.offsetWidth + 16 || 296;  

  function scrollToCard(index) {
    const maxIndex = cards.length - 1;
    if (index < 0) index = 0;
    if (index > maxIndex) index = maxIndex;
    carousel.scrollTo({
      left: index * cardWidth,
      behavior: "smooth"
    });
    currentIndex = index;
  }

  if (leftBtn && rightBtn && cards.length) {
    leftBtn.addEventListener("click", () => {
      scrollToCard(currentIndex - 1);
    });

    rightBtn.addEventListener("click", () => {
      scrollToCard(currentIndex + 1);
    });

    // Autoplay every 3 seconds
    setInterval(() => {
      let nextIndex = (currentIndex + 1) % cards.length;
      scrollToCard(nextIndex);
    }, 3000);
  }
});

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
    onOpen: () => {
      setTimeout(() => {
        checkinInput._flatpickr.calendarContainer.style.width = "auto";
      }, 100);
    },
    onChange: function (selectedDates) {
      if (selectedDates.length > 0) {
        const minCheckoutDate = new Date(selectedDates[0]);
        minCheckoutDate.setDate(minCheckoutDate.getDate() + 1); // +1 day
        checkoutPicker.set("minDate", minCheckoutDate);
        checkoutPicker.clear(); // Clear old value if user reselects check-in
        setTimeout(() => {
          checkoutPicker.open(); // Automatically open checkout calendar
        }, 200);
      }
    }
  });

  checkoutPicker = flatpickr(checkoutInput, {
    minDate: "today",
    dateFormat: "M j, Y",
    onOpen: () => {
      setTimeout(() => {
        checkoutInput._flatpickr.calendarContainer.style.width = "auto";
      }, 100);
    }
  });

  // =========================
  // Guest Dropdown
  // =========================

  const guestField = document.getElementById("guest-field");
  const guestDropdown = document.getElementById("guest-dropdown");
  const guestInput = document.getElementById("guests");
  const doneBtn = document.getElementById("done-btn");
  const petsCheckbox = document.getElementById("pets");
  const counts = { adults: 2, children: 0 };

  // Toggle guest dropdown
  guestField.addEventListener("click", function (e) {
    const isClickInsideDropdown = guestDropdown.contains(e.target);
    const isButton = e.target.closest("button");
    if (!isClickInsideDropdown && !isButton) {
      e.stopPropagation();
      guestDropdown.classList.toggle("hidden");
    }
  });

  // Close guest dropdown on outside click
  document.addEventListener("click", function (e) {
    if (!guestDropdown.contains(e.target) && !guestField.contains(e.target)) {
      guestDropdown.classList.add("hidden");
    }
  });

  // Prevent dropdown close on internal click
  guestDropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Plus/minus button behavior
  document.querySelectorAll(".plus, .minus").forEach((btn) => {
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

  // Done button updates input
  doneBtn.addEventListener("click", () => {
    const pets = petsCheckbox.checked;
    let summary = `${counts.adults} adults · ${counts.children} children`;
    if (pets) summary += " · pets";
    guestInput.value = summary;
    guestDropdown.classList.add("hidden");
  });

  // =========================
  // Hamburger Menu Dropdown
  // =========================

  const hamburger = document.getElementById("hamburger-menu");
  const menuDropdown = document.getElementById("menu-dropdown");

  hamburger.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent closing on immediate open
    menuDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", function () {
    menuDropdown.classList.add("hidden");
  });

  menuDropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // =========================
  // Scroll Behavior: Mini Search Bar
  // =========================

  const largeSearch = document.querySelector(".searchBar-container");
  const miniSearch = document.getElementById("mini-search-bar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 120) {
      largeSearch.classList.add("hidden");
      miniSearch.classList.add("visible");
    } else {
      largeSearch.classList.remove("hidden");
      miniSearch.classList.remove("visible");
    }
  });

  // =========================
  // Mini Search Bar Interaction
  // =========================

  document.getElementById("mini-where").addEventListener("click", () => expandFullSearch("where"));
  document.getElementById("mini-date").addEventListener("click", () => expandFullSearch("date"));
  document.getElementById("mini-guests").addEventListener("click", () => expandFullSearch("guests"));

  function expandFullSearch(focusTarget) {
    const heroOffset = document.getElementById("hero").offsetTop;

    window.scrollTo({
      top: heroOffset,
      behavior: "smooth"
    });

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
});

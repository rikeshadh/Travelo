document.addEventListener("DOMContentLoaded", function () {
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  const guestField = document.getElementById("guest-field");
  const guestDropdown = document.getElementById("guest-dropdown");
  const guestInput = document.getElementById("guests");
  const doneBtn = document.getElementById("done-btn");
  const petsCheckbox = document.getElementById("pets");
  const counts = { adults: 2, children: 0 };

  // Date pickers
  flatpickr(checkinInput, {
    minDate: "today",
    dateFormat: "M j, Y",
    onOpen: () => {
      setTimeout(() => {
        checkinInput._flatpickr.calendarContainer.style.width = "auto";
      }, 100);
    },
  });

  flatpickr(checkoutInput, {
    minDate: "today",
    dateFormat: "M j, Y",
    onOpen: () => {
      setTimeout(() => {
        checkoutInput._flatpickr.calendarContainer.style.width = "auto";
      }, 100);
    },
  });

  // Toggle dropdown only when clicking guest field itself
  guestField.addEventListener("click", function (e) {
    const isClickInsideDropdown = guestDropdown.contains(e.target);
    const isButton = e.target.closest("button");
    if (!isClickInsideDropdown && !isButton) {
      e.stopPropagation();
      guestDropdown.classList.toggle("hidden");
    }
  });

  // Hide dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!guestDropdown.contains(e.target) && !guestField.contains(e.target)) {
      guestDropdown.classList.add("hidden");
    }
  });

  // Prevent click inside dropdown from closing it
  guestDropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Plus/minus buttons
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

  // Done button behavior
  doneBtn.addEventListener("click", () => {
    const pets = petsCheckbox.checked;
    let summary = `${counts.adults} adults · ${counts.children} children`;
    if (pets) summary += " · pets";
    guestInput.value = summary;
    guestDropdown.classList.add("hidden");
  });
});




// Hamburger Menu Dropdown
const hamburger = document.getElementById("hamburger-menu");
const menuDropdown = document.getElementById("menu-dropdown");

// Toggle dropdown on hamburger click
hamburger.addEventListener("click", function (e) {
  e.stopPropagation(); // Prevent click from closing it immediately
  menuDropdown.classList.toggle("hidden");
});

// Close dropdown on outside click
document.addEventListener("click", function () {
  menuDropdown.classList.add("hidden");
});

// Prevent dropdown from closing when clicking inside it
menuDropdown.addEventListener("click", function (e) {
  e.stopPropagation();
});

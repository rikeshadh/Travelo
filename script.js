document.addEventListener("DOMContentLoaded", function () {
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  const guestTrigger = document.getElementById("guests-trigger");
  const guestDropdown = document.getElementById("guest-dropdown");
  const guestInput = document.getElementById("guests");
  const doneBtn = document.getElementById("done-btn");
  const petsCheckbox = document.getElementById("pets");

  const counts = { adults: 2, children: 0 };

  // Flatpickr: Check-in
  const checkinCalendar = flatpickr(checkinInput, {
    minDate: "today",
    dateFormat: "M j, Y",
    onChange: function (selectedDates) {
      if (selectedDates.length > 0) {
        checkoutCalendar.open(); // open checkout after selecting check-in
      }
    }
  });

  // Flatpickr: Checkout
  const checkoutCalendar = flatpickr(checkoutInput, {
    minDate: "today",
    dateFormat: "M j, Y"
  });

  // Toggle guest dropdown
  guestTrigger.addEventListener("click", function (e) {
    e.stopPropagation();
    guestDropdown.classList.toggle("hidden");
  });

  // Close dropdown on outside click
  document.addEventListener("click", function () {
    guestDropdown.classList.add("hidden");
  });

  // Prevent closing when clicking inside dropdown
  guestDropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  // Guest increment/decrement
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

  // "Done" button
  doneBtn.addEventListener("click", () => {
    const pets = petsCheckbox.checked;
    let summary = `${counts.adults} adults · ${counts.children} children`;
    if (pets) summary += " · pets";
    guestInput.value = summary;
    guestDropdown.classList.add("hidden");
  });
});

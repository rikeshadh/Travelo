document.addEventListener("DOMContentLoaded", function () {
  const dateTrigger = document.getElementById("date-trigger");
  const calendarDropdown = document.getElementById("calendar-dropdown");
  const dateRangeInput = document.getElementById("date-range");
  const guestTrigger = document.getElementById("guests-trigger");
  const guestDropdown = document.getElementById("guest-dropdown");
  const guestInput = document.getElementById("guests");
  const doneBtn = document.getElementById("done-btn");
  const petsCheckbox = document.getElementById("pets");

  const counts = { adults: 2, children: 0 };
  let calendarInitialized = false;

  // Handle calendar click
  dateTrigger.addEventListener("click", function (e) {
    e.stopPropagation();
    guestDropdown.classList.add("hidden");
    calendarDropdown.classList.toggle("hidden");

    if (!calendarInitialized) {
      flatpickr(dateRangeInput, {
        mode: "range",
        minDate: "today",
        inline: true,
        showMonths: 2,
        dateFormat: "M j, Y",
        appendTo: calendarDropdown,
        onChange: function (selectedDates, dateStr, instance) {
          if (selectedDates.length === 2) {
            const [start, end] = selectedDates;
            const formatted = `${instance.formatDate(start, "M j")} - ${instance.formatDate(end, "M j")}`;
            dateRangeInput.value = formatted;
            calendarDropdown.classList.add("hidden");
          }
        }
      });
      calendarInitialized = true;
    }
  });

  // Guest dropdown
  guestTrigger.addEventListener("click", function (e) {
    e.stopPropagation();
    calendarDropdown.classList.add("hidden");
    guestDropdown.classList.toggle("hidden");
  });

  // Plus and minus buttons
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

  // Done button in guest dropdown
  doneBtn.addEventListener("click", () => {
    const pets = petsCheckbox.checked;
    let summary = `${counts.adults} adults · ${counts.children} children · 1 room`;
    if (pets) summary += " · pets";
    guestInput.value = summary;
    guestDropdown.classList.add("hidden");
  });

  // Click outside to close both dropdowns
  document.addEventListener("click", () => {
    calendarDropdown.classList.add("hidden");
    guestDropdown.classList.add("hidden");
  });

  // Stop inside dropdowns from closing
  calendarDropdown.addEventListener("click", (e) => e.stopPropagation());
  guestDropdown.addEventListener("click", (e) => e.stopPropagation());
});

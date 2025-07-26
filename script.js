// script.js

const searchForm = document.getElementById('search-form');
const destinationInput = document.getElementById('destination');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const guestsInput = document.getElementById('guests');
const errorMsg = document.getElementById('error-msg');

// Ensure error message is hidden on initial load
window.addEventListener('DOMContentLoaded', () => {
  errorMsg.classList.add('hidden');
});

// Handle form submission
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Reset previous errors
  [destinationInput, checkinInput, checkoutInput, guestsInput].forEach(input => input.classList.remove('error'));
  errorMsg.classList.add('hidden');

  const destination = destinationInput.value.trim();
  const checkin = checkinInput.value;
  const checkout = checkoutInput.value;
  const guests = parseInt(guestsInput.value.replace(/\D/g, ''), 10);

  let hasError = false;

  if (!destination) {
    destinationInput.classList.add('error');
    hasError = true;
  }

  if (!checkin || !checkout || new Date(checkin) >= new Date(checkout)) {
    checkinInput.classList.add('error');
    checkoutInput.classList.add('error');
    hasError = true;
  }

  if (!guests || guests <= 0) {
    guestsInput.classList.add('error');
    hasError = true;
  }

  if (hasError) {
    errorMsg.classList.remove('hidden');
    return;
  }

  // All valid: simulate search
  console.log('🔍 Search submitted:', {
    Destination: destination,
    CheckIn: checkin,
    CheckOut: checkout,
    Guests: guests,
  });

  alert(`Searching for: ${destination}\nFrom ${checkin} to ${checkout}\nFor ${guests} guest(s)`);
});


// Guest dropdown logic (NO DUPLICATE DECLARATIONS HERE)
const guestDropdown = document.getElementById('guest-dropdown');
const doneButton = document.getElementById('guest-done');

// Toggle dropdown when clicking guest input
guestsInput.addEventListener('click', function (e) {
  guestDropdown.style.display = 'block';
  e.stopPropagation();
});

// Hide dropdown when clicking outside
document.addEventListener('click', function () {
  guestDropdown.style.display = 'none';
});

// Prevent closing when clicking inside dropdown
guestDropdown.addEventListener('click', function (e) {
  e.stopPropagation();
});

// Save and close dropdown when "Done" is clicked
doneButton.addEventListener('click', function () {
  const adults = document.getElementById('adults-count').value;
  const children = document.getElementById('children-count').value;
  const infants = document.getElementById('infants-count').value;
  const pets = document.getElementById('pets-toggle').checked ? ' with pets' : '';

  const summary = `${adults} Adults, ${children} Children, ${infants} Infants${pets}`;
  guestsInput.value = summary;

  guestDropdown.style.display = 'none';
});

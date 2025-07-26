// script.js

const searchForm = document.getElementById('search-form');
const destinationInput = document.getElementById('destination');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const guestsInput = document.getElementById('guests');
const errorMsg = document.getElementById('error-msg');

// Handle search
searchForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Reset error visuals
  [destinationInput, checkinInput, checkoutInput, guestsInput].forEach(input => input.classList.remove('error'));
  errorMsg.classList.add('hidden');

  const destination = destinationInput.value.trim();
  const checkin = checkinInput.value;
  const checkout = checkoutInput.value;
  const guests = parseInt(guestsInput.value);

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

  // If all fields are valid
  console.log('🔍 Search submitted:', {
    Destination: destination,
    CheckIn: checkin,
    CheckOut: checkout,
    Guests: guests,
  });

  alert(`Searching for: ${destination}\nFrom ${checkin} to ${checkout}\nFor ${guests} guest(s)`);
});

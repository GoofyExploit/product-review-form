// Select all rating boxes
const ratingBoxes = document.querySelectorAll(".rating-box1, .rating-box2");

// Loop through each rating box and add functionality to its stars
ratingBoxes.forEach(ratingBox => {
  const stars = ratingBox.querySelectorAll(".stars i");
  const ratingInput = document.getElementById('rating'); // Get the hidden input for rating

  stars.forEach((star, index1) => {
    star.addEventListener("click", () => {
      stars.forEach((star, index2) => {
        // If the current star's index is less than or equal to the clicked star's index, activate it
        // Otherwise, remove the "active" class
        if (index1 >= index2) {
          star.classList.add("active");
        } else {
          star.classList.remove("active");
        }
      });
      // Set the value of the hidden input to the selected rating
      ratingInput.value = index1 + 1; // index1 is 0-based, so add 1 for the rating
    });
  });
});


const form = document.querySelector("form");
const name = document.querySelector("#name");
const error = document.querySelector("#error");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (name.value) {
    const item = {
      name: name.value,
    };
  } else {
    error.textContent = "Please enter values before submitting";
  }
});

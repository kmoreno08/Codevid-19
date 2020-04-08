const form = document.querySelector("form");
const name = document.querySelector("#name");
const error = document.querySelector("#error");

// when click on submit form
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let confirmedCases = 0;
  let deathCounter = 0;

  // check if state name is in database
  if (name.value) {
    // Loop through data
    for (let i = 0; i < US_state_data.length; i++) {
      // Grab state name through each array object
      let stateCheck = US_state_data[i].Province_State;
      // if  user input equals state name in data then save data
      if (name.value == stateCheck) {
        let tempCases = +US_state_data[i].Confirmed;
        let tempDeaths = +US_state_data[i].Deaths;
        confirmedCases += tempCases;
        deathCounter += tempDeaths;
        error.textContent = "Worked";
      } else {
        error.textContent = "${mortalityRatePerc}";
      }
    }
  } else {
    error.textContent = "Outside else";
  }
  console.log(confirmedCases);
  console.log(deathCounter);
  console.log(deathCounter / confirmedCases);

  // mortality rate percentage
  let mortalityRatePerc = parseFloat(
    (deathCounter / confirmedCases) * 100
  ).toFixed(2);

  console.log(mortalityRatePerc);
});

// get all workout data from back-end
fetch("/api/workouts")
  .then(response => {
    return response.json();
  })
  .then(data => {
    populateChart(data);
  });

function populateChart(data) {
  let durations = duration(data);
  let pounds = weightByDay(data);
  let workouts = workoutDurations(data);
  let totalResistance = resistanceWeight(data);
  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");

  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      datasets: [
        {
          label: "Workout Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: durations,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ]
      }
    }
  });

  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: "Resistance by Day",
          data: pounds,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });

  let pieChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: ["Bench Press", "Running", "Dead Lifts", "Squats", "Rowing"],
      datasets: [
        {
          label: "Workout Durations",
          backgroundColor: [
            "#3e95cd",
            "#8e5ea2",
            "#3cba9f",
            "#e8c3b9",
            "#c45850"
          ],
          data: workouts
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Workout Durations"
      }
    }
  });

  let donutChart = new Chart(pie2, {
    type: "doughnut",
    data: {
      labels: ["Bench Press", "Dead Lifts", "Squats"],
      datasets: [
        {
          label: "Total Resistance Weight",
          backgroundColor: [
            "#3e95cd",
            "#3cba9f",
            "#e8c3b9"
          ],
          data: totalResistance
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Total Resistance Weight"
      }
    }
  });
}

function duration(data) {
  // let durations = [];
  let sumDuration=0; // Summarizes duration for a day.
  let daysOfWeek=[0,0,0,0,0,0,0] // An array of the sum of 
  // the durations for each day of the week.
  let temp=0;//stores the previous number of day of the week
  data.forEach(workout => {
    var exerciseDate = new Date(workout.day);

    var exerciseDayNumOfWeek = exerciseDate.getDay();

    // Summarize all weight values for a given day.
    // If the day of the week is different, reset the sumDuration.
    if( exerciseDayNumOfWeek != temp){
      sumDuration=0;
    }

    workout.exercises.forEach(exercise => {

      sumDuration += exercise.duration; // Add a day's duration to the sum.
      daysOfWeek[exerciseDayNumOfWeek]=sumDuration; // Insert the
      // duration for that day using exerciseDayNumOfWeek as the index.
      temp=exerciseDayNumOfWeek;
    });
  });

// Change to reflect 7 days.
  return daysOfWeek;
}

function weightByDay(data) {
  let dayWeight = 0; // Summarizes resistance weight for a given day
  // the durations for each day of the week.
  let daysOfTheWeek = [0, 0, 0, 0, 0, 0, 0]; // An array of the sum of
  // the durations for each day of the week.
  let temp = 0; //stores the number of the previous day of the week

  data.forEach(workout => {
    var exerciseDate = new Date(workout.day);
    var exerciseDayNumOfWeek = exerciseDate.getDay();

    // Summarize all weight values for a given day
    // If the day of the week is different, reset dayWeight.
    if (exerciseDayNumOfWeek != temp) {
      dayWeight = 0;
    }

    workout.exercises.forEach(exercise => {
      if (isNaN(exercise.weight)) {
        return;
      } else {
        dayWeight += exercise.weight; // Add the current day's weight to the total.
        daysOfTheWeek[exerciseDayNumOfWeek] = dayWeight;
        // Insert the weight for that day using exerciseDayNumOfWeek as the index.
        temp = exerciseDayNumOfWeek;
      }
    });
  });
  // Render total weight for each day of the week.
  return daysOfTheWeek;
}

function workoutDurations(data) {
  let sumBenchDuration = 0; // Summarizes Bench Press durations
  let sumRunningDuration = 0; // Summarizes Running durations
  let sumDeadDuration = 0; // Summarizes Dead Lifts durations
  let sumSquatsDuration = 0; // Summarizes Squats durations
  let sumRowingDuration = 0; // Summarizes Rowing durations
  let workoutDuration = [0, 0, 0, 0, 0]; // An array the sum of
  // the durations for each workout.
  data.forEach(workout => {
    // Add up duration totals for each exercise.
    workout.exercises.filter(exercise => {
      let exName = exercise.name;
      let duration = exercise.duration;
      switch(exName) {
        case "Bench Press":
            sumBenchDuration += duration;
            workoutDuration[0] = sumBenchDuration;
            break;
        case "Running":
            sumRunningDuration += duration;
            workoutDuration[1] = sumRunningDuration;
            break;
        case "Dead Lifts":
            sumDeadDuration += duration;
            workoutDuration[2] = sumDeadDuration;
            break;
        case "Squats":
            sumSquatsDuration += duration;
            workoutDuration[3] = sumSquatsDuration;
            break;
        case "Rowing":
            sumRowingDuration += duration;
            workoutDuration[4] = sumRowingDuration;
            break;
        default:
          return;
      }
    })
  })
    return workoutDuration;
}

// Add up total resistance weight for donut graph
function resistanceWeight(data) {
  let sumBenchWeight = 0; // Summarizes Bench Press weight
  let sumDeadWeight = 0; // Summarizes Dead Lifts weight
  let sumSquatsWeight = 0; // Summarizes Squats weight
  let totalWeight = [0, 0, 0]; // An array of the sum of
  // the weights for each resistance workout.
  data.forEach(workout => {
    // Add up weight totals for each exercise.
    workout.exercises.filter(exercise => {
      let exName = exercise.name;
      let weight = exercise.weight;
      switch(exName) {
        case "Bench Press":
            sumBenchWeight += weight;
            totalWeight[0] = sumBenchWeight;
            break;
        case "Dead Lifts":
            sumDeadWeight += weight;
            totalWeight[1] = sumDeadWeight;
            break;
        case "Squats":
            sumSquatsWeight += weight;
            totalWeight[2] = sumSquatsWeight;
            break;
        default:
          return;
      }
    })
  })
    return totalWeight;
}
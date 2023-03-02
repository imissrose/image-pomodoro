// Get elements
const imageInput = document.getElementById('image-input');
const image = document.getElementById("image");
//const timer = document.getElementById("timer");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const startButton = document.getElementById("start");
const pauseButton = document.getElementById("pause");
const stopButton = document.getElementById("stop");
const selectBox = document.getElementById("image-effect");
const imageBox = document.querySelector('.image-container');

// Set default values
let minutes = 0;
let seconds = 0;
let timerId;
let isPaused = false;

// Add event listeners
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
stopButton.addEventListener("click", stopTimer);

let imageWidth = 0;
let revealType;

// Functions
function startTimer() {
  if (!timerId) {console.log('timerId', timerId);
    revealType = selectBox.value;
    initMinutes = minutesInput.value;
    initSeconds = parseInt(secondsInput.value);
    minutes = initMinutes;
    seconds = initSeconds;
    if (revealType === "gradual") {
      image.style.opacity = 0;
      image.style.clipPath = `inset(0 0 0 0)`;
    } else if (revealType === "top-down") {
      image.style.clipPath = `inset(0 0 100% 0)`;
      image.style.opacity = 1;
    } else if (revealType === "bottom-up") {
      image.style.clipPath = `inset(100% 0 0 0)`;
      image.style.opacity = 1;
    }
    timerId = setInterval(updateTimer, 1000);
    
    selectBox.disabled = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
  } else {
    timerId = setInterval(updateTimer, 1000);
  }

  startButton.disabled = true;
  pauseButton.disabled = false;
  stopButton.disabled = false;
}

function pauseTimer() {
  isPaused = !isPaused;
  clearInterval(timerId);
  startButton.disabled = false;
  pauseButton.disabled = true;
/*
  isPaused = !isPaused;
  if (isPaused) {
    clearInterval(timerId);
    pauseButton.innerHTML = "Resume";
  } else {
    timerId = setInterval(updateTimer, 1000);
    pauseButton.innerHTML = "Pause";
  }*/
}

function stopTimer() {
  clearInterval(timerId);
  timerId = null;
  minutesInput.value = padNumber(initMinutes);
  minutesInput.value = padNumber(initSeconds);
  minutes = 0;
  seconds = 0;
  updateTimerDisplay(initMinutes, initSeconds);
  startButton.disabled = false;
  pauseButton.disabled = true;
  stopButton.disabled = true;
  selectBox.disabled = false;
  minutesInput.disabled = false;
  secondsInput.disabled = false;
}

function updateTimer() {
  if (parseInt(seconds) === 0) {
    if (parseInt(minutes) === 0) {
      clearInterval(timerId);
      timerId = null;
      //image.style.opacity = 1;
      startButton.disabled = true;
      pauseButton.disabled = true;
      stopButton.disabled = false;
    } else {
      minutes--;
      seconds = 59;
    }
  } else {
    seconds--;
  }
  updateTimerDisplay(minutes, seconds);
  updateImageDisplay();
}
  
function updateTimerDisplay(minutes, seconds) {
  minutesInput.value = padNumber(minutes);
  secondsInput.value = padNumber(seconds);
  //timer.value = `${padNumber(minutes)}:${padNumber(seconds)}`;
}
  
function padNumber(number) {
  if (number < 10) {
    return "0" + parseInt(number);
  } else {
    return number;
  }
}
  
function updateImageDisplay() {
  const initialSeconds = initMinutes * 60 + initSeconds;
  const totalSeconds = minutes * 60 + seconds;
  const percentComplete = totalSeconds / initialSeconds;

  if (revealType === "gradual") {
    let opacity = (initialSeconds - totalSeconds) / initialSeconds;
    image.style.opacity = opacity;
  } else if (revealType === "top-down") {
    image.style.clipPath = `inset(0 0 ${percentComplete * 100}% 0)`;
  } else if (revealType === "bottom-up") {
    image.style.clipPath = `inset(${percentComplete * 100}% 0 0 0)`;
  }
}

// add event listener to file input to change image when a file is selected
document.getElementById("image-input").addEventListener("change", function(event) {
  //imageBox.style.opacity = 1;
  const file = imageInput.files[0];
  const imageUrl = URL.createObjectURL(file);
  image.src = imageUrl;
  imageWidth = image.offsetWidth;
  //console.log('imageWidth', imageWidth);
  //console.log('image.height', image.height);
  //imageBox.imageWidth = imageWidth;
  //imageBox.height = image.height;
  //console.log('imageBox.height', imageBox.height);
  //console.log('imageBox.imageWidth', imageBox.imageWidth);

/*
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function() {
    image.setAttribute("src", reader.result);
    //image.style.display = "block";
    imageWidth = image.offsetWidth;
    imageBox.imageWidth = imageWidth;
    imageBox.height = image.height;
    //console.log('imageBox.height', imageBox.height);
    //console.log('imageBox.imageWidth', imageBox.imageWidth);
  };
  reader.readAsDataURL(file);*/

});

// Add event listeners
imageBox.addEventListener('dblclick', function() {
    document.getElementById('image-input').click();
  });

minutesInput.addEventListener('input', function() {
  minutesInput.value = padNumber(minutesInput.value);
});

secondsInput.addEventListener('input', function() {
  secondsInput.value = padNumber(secondsInput.value);
});
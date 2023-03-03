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
const messageInput = document.getElementById("message");
const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');

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
  if (!timerId) {
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

    saveTimerSettings();
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

      if (toggleSwitch.checked) {
        showModal(messageInput.value);
      }
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
  document.getElementById('upload-message').innerText = "";
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

function showModal(message) {
  var modal = document.querySelector('.modal');
  var modalMessage = document.querySelector('.modal-message');
  var modalClose = document.querySelector('.modal-close');

  modal.style.display = 'block';
  modalMessage.textContent = message;

  modalClose.onclick = function() {
    modal.style.display = 'none';
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
}

document.addEventListener('load', function() {
  // code to be executed when the document is fully loaded
  loadTimerSettings();
});

// 분, 초를 두자리로 보여줌
minutesInput.addEventListener('input', function() {
  minutesInput.value = padNumber(minutesInput.value);
});

secondsInput.addEventListener('input', function() {
  secondsInput.value = padNumber(secondsInput.value);
});

toggleSwitch.addEventListener('change', function() {
  if (toggleSwitch.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }  
});


// image-container를 더블클릭/롱프레스시 이미지 첨부
let isTouchDevice = ('ontouchstart' in document.documentElement);
let lastClickTime = 0;

if (isTouchDevice) {
  // Touch-based devices
  let pressTimer;

  imageBox.addEventListener('touchstart', function(event) {
    pressTimer = setTimeout(function() {
      // Perform long-press logic
      document.getElementById('image-input').click();
    }, 500); // Long-press duration (in milliseconds)
  });

  imageBox.addEventListener('touchend', function(event) {
    clearTimeout(pressTimer);
  });

  document.getElementById('upload-message').innerText = 'Long press to add an image.';

} else {
  // Mouse-based devices
  imageBox.addEventListener('mousedown', function(event) {
    if (event.detail === 2) {
      // Perform double-click logic
      document.getElementById('image-input').click();

    }
  });

  imageBox.addEventListener('click', function(event) {
    // Perform single-click logic
  });

  document.getElementById('upload-message').innerText = 'Double-click here to add an image.';
}

// 쿠키, Localstorage에 저장
// Check if running in a web browser or application
const isWebBrowser = (window.location.protocol.startsWith('http') || window.location.hostname === 'localhost');

function saveTimerSettings() {
  // Save data to cookie or localstorage
  const data = {
    //imagePath: `${image.src}`,
    imageEffect: `${selectBox.value}`,
    minutes: `${minutesInput.value}`,
    seconds: `${secondsInput.value}`,
    message: `${messageInput.value}`,
    notifications: `${toggleSwitch.checked}`
  };

  if (isWebBrowser) {
    // Set cookie expiration to 14 days
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 14);

    // Save data to cookie
    document.cookie = `pomodoroData=${JSON.stringify(data)};expires=${expirationDate.toUTCString()};path=/`;
  } else {
    // Save data to local storage
    localStorage.setItem('pomodoroData', JSON.stringify(data));
  }
}

function loadTimerSettings() {
  if (isWebBrowser) {
    // check if cookies exist and get their values
    if (document.cookie) {
      /*image.src = getCookie('imagePath');
      image.addEventListener('error', function() {
        image.src = "";
      });*/
      selectBox.value = getCookie('imageEffect');
      minutesInput.value = getCookie('minutes');
      secondsInput.value = getCookie('seconds');
      messageInput.value = getCookie('message');
      toggleSwitch.checked = (getCookie('notifications')==="true")?true:false;
    }

  } else {
    // check if localstorage exists and get their values
    const data = JSON.parse(localStorage.getItem('pomodoroData'));
    if (data) {
      /*image.src = data.imagePath;
      image.addEventListener('error', function() {
        image.src = '';
      });*/
      selectBox.value = data.imageEffect;
      minutesInput.value = data.minutes;
      secondsInput.value = data.seconds;
      messageInput.value = data.message;
      toggleSwitch.checked = (data.notifications==="true")?true:false;
    }
  }
}

function getCookie(cookieName) {
  const name = `${cookieName}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  
  for(let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
}

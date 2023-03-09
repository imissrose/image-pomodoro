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
//const toggleSwitch = document.querySelector('.switch input[type="checkbox"]');
const toggleSwitch = document.getElementById("message-toggle");
//const notificationToggle = document.getElementById("notification-toggle");
//const vibrationToggle = document.getElementById("vibration-toggle");

// Set default values
let minutes = 0;
let seconds = 0;
let timerId;
let isPaused = false;

startButton.disabled = false;
pauseButton.disabled = true;
stopButton.disabled = true;

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
    
    if (revealType === "fade-in") {
      image.style.opacity = 0;
    } else if (revealType === "zoom-in") {
      image.style.transform = `scale(0)`;
    } else if (revealType === "top-down") {
      image.style.clipPath = `inset(0 0 100% 0)`;
    } else if (revealType === "bottom-up") {
      image.style.clipPath = `inset(100% 0 0 0)`;
    }
    timerId = setInterval(updateTimer, 1000);
    
    selectBox.disabled = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;

    showInputCover();
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
  image.style.opacity = 1;
  image.style.transform = '';
  image.style.clipPath = '';
  hideInputCover();
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

      //requestWakeLock(); //반응 없음
      //showNotification();
      vibrateMorse(textToMorse('end'));
      //singingbowl();
      //silentVibration();
      //releaseWakeLock(); //반응 없음
      howler();

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
    return "" + parseInt(number);
  }
}
  
function updateImageDisplay() {
  const initialSeconds = initMinutes * 60 + initSeconds;
  const totalSeconds = minutes * 60 + seconds;
  const percentComplete = totalSeconds / initialSeconds;

  if (revealType === "fade-in") {
    let opacity = 1-percentComplete;
    image.style.opacity = opacity;
  } else if (revealType === "zoom-in") {
    image.style.transform = `scale(${1-percentComplete})`;
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

// 타이머 종료시 핸드폰 깜빡임
// 화면 잠금 상태에서는 실행안됨
// 앱이 백그라운드에서 실행 중일 때도 알림이 전달되도록 하려면 Android 및 iOS 모두에 대한 알림 설정해야 하나 import하자마자 css 깨짐
// 서비스 제공자가 사용자에게 보내는 푸쉬도 있지만, 해당 없음
// 서비스워커를 사용해도 화면 잠금이 풀리거나 해당 화면이 활성화 되었을때 알림 전송하므로, 해당 없음
// 진동은 화면 잠금 상태에서도 처리된다고 함. 사용자가 인지 못할 수 있고 왜 진동이 왔는지 확인 못함.
// wake lock으로 화면 잠금시 잠금을 풀수도 있지만, 모든 브라우저에서 동작하진 않음
function showNotification() {
  /*
  // Add blinking light effect
  let intervalId;
  let blinkDuration = 1000; // blink every second
  let blinkCount = 10; // blink for 10 seconds
  let blinkColor = 'red'; // color to blink
  let bodyEl = document.querySelector('body'); // select body element
  
  // start blinking
  intervalId = setInterval(() => {
    bodyEl.style.backgroundColor = bodyEl.style.backgroundColor === blinkColor ? '' : blinkColor;
    blinkCount--;
    if (blinkCount === 0) clearInterval(intervalId); // stop blinking after 10 seconds
  }, blinkDuration);*/

  // If it's not touch base, return
  if (!('ontouchstart' in window)) return;

  if ('Notification' in window) {
    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        var notification = new Notification('Timer ended', {
          body: 'Your timer has ended!',
          //icon: 'path/to/icon.png'
        });
        notification.onclick = function() {
          window.focus();
          this.close();
        };
      }
    });
  }
}

// 모스부호 start
// Define Morse code dictionary
const morseDict = {
  'a': '.-',    'b': '-...',  'c': '-.-.',  'd': '-..',
  'e': '.',     'f': '..-.',  'g': '--.',   'h': '....',
  'i': '..',    'j': '.---',  'k': '-.-',   'l': '.-..',
  'm': '--',    'n': '-.',    'o': '---',   'p': '.--.',
  'q': '--.-',  'r': '.-.',   's': '...',   't': '-',
  'u': '..-',   'v': '...-',  'w': '.--',   'x': '-..-',
  'y': '-.--',  'z': '--..',  ' ': ' ',
};

// Convert text to Morse code
function textToMorse(text) {
  return text.toLowerCase().split('').map(char => morseDict[char]).join(' ');
}

// Vibrate device in Morse code
function vibrateMorse(morseCode) {
  const dotDuration = 200;
  const dashDuration = dotDuration * 3;
  const spaceDuration = dotDuration;
  navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

  if (navigator.vibrate) {
    // Iterate through each Morse code character and vibrate accordingly
    morseCode.split('').forEach(char => {
      if (char === '.') {
        navigator.vibrate(dotDuration);
      } else if (char === '-') {
        navigator.vibrate(dashDuration);
      } else if (char === ' ') {
        navigator.vibrate(spaceDuration);
      }
    });
  }
}
// 모스 부호 end

// 싱잉볼
function singingbowl() {
  // create the AudioContext
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // set up the parameters for the sound
  const frequency = 440; // in hertz
  //const frequency = 75; // in hertz
  const duration = 2; // in seconds

  // create the oscillator node
  const oscillator = audioCtx.createOscillator();
  oscillator.type = 'sine'; // set the waveform to sine wave
  oscillator.frequency.value = frequency;

  // create the gain node to control the volume
  const gainNode = audioCtx.createGain();
  //gainNode.gain.setValueAtTime(0, audioCtx.currentTime); // start with volume at 0
  const now = audioCtx.currentTime;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(1, now + 0.1);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

  // connect the nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // start the oscillator
  oscillator.start();

  // fade in the volume over the duration of the sound
  //gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + duration);

  // stop the oscillator after the duration of the sound
  oscillator.stop(audioCtx.currentTime + duration);
}

// 소리없는 진동
// 스마트폰에서 거의 느껴지지 않음
function silentVibration() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // create audio context
  const oscillator = audioCtx.createOscillator(); // create oscillator
  const gainNode = audioCtx.createGain(); // create gain node
  const duration = 0.5; // in seconds

  oscillator.connect(gainNode); // connect oscillator to gain node
  gainNode.connect(audioCtx.destination); // connect gain node to audio context destination

  oscillator.frequency.value = 100; // set frequency to 100 Hz
  //oscillator.frequency.value = 70;
  gainNode.gain.value = 1; // set gain to maximum

   // start the oscillator
   oscillator.start();
 
   // stop the oscillator after the duration of the sound
   oscillator.stop(audioCtx.currentTime + duration);
}

// 잠금 깨우기
let wakeLock = null;

function requestWakeLock() {
  navigator.wakeLock.request('screen', { display: 'display' })
    .then((lock) => {
      wakeLock = lock;
    })
    .catch((err) => {
      console.error(`${err.name}, ${err.message}`);
    });
}

function releaseWakeLock() {
  if (wakeLock !== null) {
    wakeLock.release();
    wakeLock = null;
  }
}

function howler() {
  var sound = new Howl({
    src: ['./Click13.wav']
  });

  // Play the sound
  sound.play();

  // Stop the sound after 3 seconds
  //setTimeout(function() {
  //  sound.stop();
  //}, 1000);
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

function showInputCover() {
  let inputCover = document.getElementById("input-cover");
  let lableCover = document.getElementById("lable-cover");
  inputCover.style.display = "block";
  lableCover.style.display = "block";
}

function hideInputCover() {
  let inputCover = document.getElementById("input-cover");
  let lableCover = document.getElementById("lable-cover");
  inputCover.style.display = "none";
  lableCover.style.display = "none";
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
      const data = JSON.parse(document.cookie);
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

// viewport 사이즈에 따라 버튼, 폰트 등 변경
window.addEventListener("load", setViewportHeight);

// Check if device is touch-based
if (!isTouchDevice) {
  // If mouse-based, set the user_vh value based on the window height when the window is resized
  window.addEventListener("resize", setViewportHeight);
}

function setViewportHeight() {
  // Set the user_vh value based on the window height
  let user_vh = window.innerHeight * 0.01;
  let user_vw = window.innerWidth * 0.01;
  let user_ramain_vh;

  if (user_vw > user_vh*9/16) {
    user_vw = user_vh*9/16;
  }

  if (user_vh > user_vw*16/9) {
    user_vh = user_vw*16/9;
  }

  user_ramain_vh = (window.innerHeight * 0.01 - user_vh)*100;
  
  if (user_ramain_vh > 0) {
    document.documentElement.style.setProperty("--user-remain-vh", `${user_ramain_vh}px`);
    
  }
  
  // Set the height of the viewport using the user_vh value
  document.documentElement.style.setProperty("--user-vh", `${user_vh}px`);
  document.documentElement.style.setProperty("--user-vw", `${user_vw}px`);
}

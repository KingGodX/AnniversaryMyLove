// Configs
const PASSCODE = '110768'; // Simplified default passcode
const START_DATE = new Date('2025-07-11T00:00:00'); // Date: 11 July 2568 (2025)

// DOM Elements
const pages = {
    gift: document.getElementById('page-gift'),
    passcode: document.getElementById('page-passcode'),
    flowers: document.getElementById('page-flowers'),
    menu: document.getElementById('page-menu'),
    timer: document.getElementById('page-timer'),
    letter: document.getElementById('page-letter'),
    reason: document.getElementById('page-reason'),
    gallery: document.getElementById('page-gallery')
};

const passcodeInput = document.getElementById('passcode-input');
const errorMsg = document.getElementById('error-msg');


// Keypad Logic
window.addDigit = function (digit) {
    if (passcodeInput.value.length < 6) {
        passcodeInput.value += digit;
        errorMsg.style.display = 'none';

        // Remove shake effect if present
        passcodeInput.classList.remove('shake');
    }
}

window.deleteDigit = function () {
    passcodeInput.value = passcodeInput.value.slice(0, -1);
    errorMsg.style.display = 'none';
}

// Navigation
function showPage(pageId) {
    // Hide all pages
    Object.values(pages).forEach(page => {
        if (page) page.classList.remove('active');
    });
    // Show target page
    if (pages[pageId]) {
        pages[pageId].classList.add('active');
    }
}

// Event Listeners
// Event Listeners
document.getElementById('open-gift-btn').addEventListener('click', () => {
    showPage('passcode');
    // Play music on first interaction (User allowed)
    if (player) {
        player.unMute();
        player.playVideo();
        vinyl.classList.add('playing');
        musicContainer.classList.add('playing');
        isPlaying = true;
    }
});

document.getElementById('passcode-btn').addEventListener('click', () => {
    if (passcodeInput.value === PASSCODE) {
        showPage('flowers');
    } else {
        errorMsg.style.display = 'block';
        passcodeInput.classList.add('shake');
        setTimeout(() => passcodeInput.classList.remove('shake'), 500);
    }
});

// Receive Flowers Logic
if (document.getElementById('receive-flowers-btn')) {
    document.getElementById('receive-flowers-btn').addEventListener('click', () => {
        showPage('menu');
    });
}

// Letter Logic
if (document.getElementById('read-letter-btn')) {
    document.getElementById('read-letter-btn').addEventListener('click', () => {
        document.getElementById('letter-cover').classList.add('hidden');
        document.getElementById('letter-content').classList.remove('hidden');
    });
}

// Music Player Logic (YouTube API)
const musicContainer = document.getElementById('music-container');
const vinyl = document.getElementById('vinyl');
let player;
let isPlaying = false;

// 1. YouTube API ready function
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '-2OgtZxiTGc',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'loop': 1,
            'playlist': '-2OgtZxiTGc',
            'origin': window.location.origin
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

// 2. Player ready callback
function onPlayerReady(event) {
    // Attempt to play immediately (Browser might block this without interaction)
    event.target.setVolume(100);
    event.target.playVideo();

    // If successful, update UI
    if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        vinyl.classList.add('playing');
        musicContainer.classList.add('playing');
        isPlaying = true;
    }
}

// 3. Control Logic
if (musicContainer) {
    musicContainer.addEventListener('click', () => {
        if (!player) return;

        if (!isPlaying) {
            player.playVideo();
            vinyl.classList.add('playing');
            musicContainer.classList.add('playing');
            isPlaying = true;
        } else {
            player.pauseVideo();
            vinyl.classList.remove('playing');
            musicContainer.classList.remove('playing');
            isPlaying = false;
        }
    });
}

// Menu Navigation
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const target = item.dataset.target;
        showPage(target);
    });
});

// Back Buttons
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showPage('menu');
    });
});

// Timer Logic
function updateTimer() {
    const now = new Date();
    const diff = now - START_DATE;

    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    // Update elements if they exist
    if (document.getElementById('t-total-days')) document.getElementById('t-total-days').innerText = totalDays;
    if (document.getElementById('t-total-days-footer')) document.getElementById('t-total-days-footer').innerText = totalDays;
    if (document.getElementById('t-days-detail')) document.getElementById('t-days-detail').innerText = totalDays;
    if (document.getElementById('t-hours')) document.getElementById('t-hours').innerText = hours;
    if (document.getElementById('t-minutes')) document.getElementById('t-minutes').innerText = minutes;
    if (document.getElementById('t-seconds')) document.getElementById('t-seconds').innerText = seconds;
}
setInterval(updateTimer, 1000);
updateTimer();

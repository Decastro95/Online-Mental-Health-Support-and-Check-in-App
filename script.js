/* Mental Health Check‑In App Logic */


const moods = document.querySelectorAll('.moods button');
const noteField = document.querySelector('textarea');
const tipBox = document.getElementById('tip');


const tips = [
"Take three slow breaths and relax your shoulders.",
"It’s okay to rest. Productivity is not your worth.",
"Talking to someone you trust can help.",
"Small steps forward still count.",
"You are not alone in how you feel."
];


// Load daily tip
tipBox.innerText = tips[Math.floor(Math.random() * tips.length)];


// Load saved data
const today = new Date().toDateString();
const savedData = JSON.parse(localStorage.getItem('checkin')) || {};


if (savedData.date === today) {
if (savedData.moodIndex !== undefined) {
moods[savedData.moodIndex].classList.add('selected');
}
noteField.value = savedData.note || '';
}


// Mood selection
moods.forEach((btn, index) => {
btn.addEventListener('click', () => {
moods.forEach(b => b.classList.remove('selected'));
btn.classList.add('selected');


saveData(index);
});
});


// Save note
noteField.addEventListener('input', () => {
const selectedIndex = [...moods].findIndex(b => b.classList.contains('selected'));
saveData(selectedIndex);
});


function saveData(moodIndex) {
const data = {
date: today,
moodIndex,
note: noteField.value
};
localStorage.setItem('checkin', JSON.stringify(data));
updateStreak();
}


// Daily streak logic
function updateStreak() {
const streakData = JSON.parse(localStorage.getItem('streak')) || { count: 0, lastDate: null };


if (streakData.lastDate !== today) {

const moods = document.querySelectorAll('.moods button');
const noteField = document.querySelector('textarea');
const tipBox = document.getElementById('tip');
const timeline = document.getElementById('timeline');
const chart = document.getElementById('moodChart');
const ctx = chart.getContext('2d');

const today = new Date().toDateString();
const MOODS = ['😊','😐','😔','😡','😴'];

const tips = [
  "You survived 100% of your hardest days.",
  "Your feelings are valid.",
  "Healing is not linear.",
  "You deserve safety and peace.",
  "Asking for help is strength."
];

tipBox.innerText = tips[Math.floor(Math.random() * tips.length)];

// Load saved data
const saved = JSON.parse(localStorage.getItem('checkin')) || {};
if (saved.date === today) {
  if (saved.mood !== undefined) moods[saved.mood].classList.add('selected');
  noteField.value = saved.note || '';
}

// Mood click
moods.forEach(btn => {
  btn.onclick = () => {
    moods.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    saveCheckin(parseInt(btn.dataset.mood));
  };
});

noteField.oninput = () => {
  const selected = document.querySelector('.moods .selected');
  if (selected) saveCheckin(parseInt(selected.dataset.mood));
};

function saveCheckin(mood) {
  localStorage.setItem('checkin', JSON.stringify({
    date: today,
    mood,
    note: noteField.value
  }));
  saveHistory(mood);
}

// History
function saveHistory(mood) {
  let history = JSON.parse(localStorage.getItem('history')) || [];
  history = history.filter(h => h.date !== today);
  history.push({ date: today, mood });
  history = history.slice(-7);
  localStorage.setItem('history', JSON.stringify(history));
  renderHistory(history);
}

function renderHistory(history) {
  timeline.innerHTML = '';
  history.forEach(h => {
    const span = document.createElement('span');
    span.innerText = MOODS[h.mood];
    timeline.appendChild(span);
  });
  drawChart(history);
}

function drawChart(history) {
  ctx.clearRect(0,0,chart.width,chart.height);
  ctx.beginPath();
  ctx.strokeStyle = '#5fb3b3';
  ctx.lineWidth = 3;

  history.forEach((h,i) => {
    const x = (i/(history.length-1||1)) * chart.width;
    const y = chart.height - (h.mood/4) * chart.height;
    i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
  });
  ctx.stroke();
}

// Emergency
document.querySelector('.panic').onclick = () => {
  alert("You’re not alone.\n\nIf you are in danger:\nCall 10111 or go to the nearest clinic.");
};

// Dark mode
const toggle = document.querySelector('.dark-toggle');
if (localStorage.getItem('dark') === 'true') document.body.classList.add('dark');

toggle.onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('dark', document.body.classList.contains('dark'));
};

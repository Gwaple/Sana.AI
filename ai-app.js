// --- HOMEPAGE LOGIC ---
function goHome() {
  document.getElementById('homePage').style.display = "";
  document.getElementById('authArea').style.display = "none";
  document.getElementById('aiApp').style.display = "none";
}
function goToLogin() {
  document.getElementById('homePage').style.display = "none";
  document.getElementById('authArea').style.display = "";
  document.getElementById('aiApp').style.display = "none";
  showLogin();
}

// --- Auth Logic (local demo) ---
function saveUser(username, password) {
  localStorage.setItem('aiapp-user-'+username, JSON.stringify({ password }));
}
function getUser(username) {
  try {
    return JSON.parse(localStorage.getItem('aiapp-user-'+username));
  } catch(e) { return null; }
}
let currentUser = '';
function login() {
  let u = document.getElementById('loginUser').value.trim();
  let p = document.getElementById('loginPass').value;
  let user = getUser(u);
  if (!u || !p) { setMsg('loginMsg', "Enter username & password."); return; }
  if (!user) { setMsg('loginMsg', "User not found."); return; }
  if (user.password !== p) { setMsg('loginMsg', "Wrong password."); return; }
  // Success:
  currentUser = u;
  document.getElementById('authArea').style.display = "none";
  document.getElementById('aiApp').style.display = "";
  document.getElementById('homePage').style.display = "none";
  document.getElementById('welcome').textContent = "🚀 Welcome, " + u + "!";
  document.getElementById('userInput').focus();
  showChat();
}
function register() {
  let u = document.getElementById('regUser').value.trim();
  let p = document.getElementById('regPass').value;
  if (!u || !p) { setMsg('registerMsg', "Enter username & password."); return; }
  if (getUser(u)) { setMsg('registerMsg', "User already exists."); return; }
  saveUser(u, p);
  setMsg('registerMsg', "Registered! You can sign in now.", true);
}
function showLogin() {
  document.getElementById('loginBox').style.display = "";
  document.getElementById('registerBox').style.display = "none";
  setMsg('loginMsg',"");setMsg('registerMsg',"");
}
function showRegister() {
  document.getElementById('loginBox').style.display = "none";
  document.getElementById('registerBox').style.display = "";
  setMsg('loginMsg',"");setMsg('registerMsg',"");
}
function logout() {
  currentUser = '';
  document.getElementById('authArea').style.display = "none";
  document.getElementById('aiApp').style.display = "none";
  document.getElementById('homePage').style.display = "";
}
function setMsg(id, msg, ok) {
  let el = document.getElementById(id);
  el.textContent = msg;
  el.style.color = ok ? "#87ffae" : "#ff6f6f";
}

// --- AI Chat Logic ---
// Use browser SpeechSynthesis (text-to-speech)
function speak(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel(); // stop any previous
  let utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.04;
  utter.pitch = 1.08;
  utter.volume = 0.92;
  utter.lang = 'en-US';
  // Optionally: pick a "spacey" voice for fun
  let voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    let sciFiVoices = voices.filter(v => /Google UK English Female|Zira|Samantha|en-US/i.test(v.name));
    utter.voice = sciFiVoices[0] || voices[0];
  }
  window.speechSynthesis.speak(utter);
}

function getChat() {
  try {
    return JSON.parse(localStorage.getItem('aiapp-chat-'+currentUser)) || [];
  } catch(e) { return []; }
}
function saveChat(chat) {
  localStorage.setItem('aiapp-chat-'+currentUser, JSON.stringify(chat));
}
function showChat() {
  let chat = getChat();
  let chatWindow = document.getElementById('chatWindow');
  chatWindow.innerHTML = "";
  chat.forEach(msg => {
    let div = document.createElement('div');
    div.className = "msg "+msg.role;
    div.innerHTML = `<div class="bubble">${msg.role==='ai' ? "🪐 " : ""}${msg.text}</div>`;
    chatWindow.appendChild(div);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}
function sendMessage() {
  let inp = document.getElementById('userInput');
  let msg = inp.value.trim();
  if(!msg) return;
  inp.value = "";
  let chat = getChat();
  chat.push({role:"user", text:msg});
  saveChat(chat);
  showChat();
  setTimeout(()=>aiRespond(msg), 700);
}
function aiRespond(userMsg) {
  // Make it conversational and space themed
  let reply = "";
  let lower = userMsg.toLowerCase();
  if(/hello|hi|hey|yo|greetings/.test(lower)) {
    reply = "Hello, star traveler! How can I illuminate your cosmic journey today?";
  } else if(/your name|who are you/.test(lower)) {
    reply = "I am SpaceBot, your AI companion among the stars. Ask me anything about the universe!";
  } else if(/black hole/.test(lower)) {
    reply = "Black holes are mysterious regions where gravity is so strong not even light can escape. If you crossed the event horizon, there'd be no turning back!";
  } else if(/planet.*life|alien|extraterrestrial|life on/.test(lower)) {
    reply = "Scientists have found thousands of exoplanets, and some may have the right conditions for life. The search for alien life is one of astronomy’s most exciting quests!";
  } else if(/light year|parsec/.test(lower)) {
    reply = "A light year is the distance light travels in one year—about 9.46 trillion kilometers! A parsec is about 3.26 light years.";
  } else if(/sun/.test(lower)) {
    reply = "The Sun is a G-type main-sequence star about 4.6 billion years old. It's the heart of our solar system!";
  } else if(/moon/.test(lower)) {
    reply = "Earth’s Moon is about 384,400 km away and helps stabilize our planet’s tilt, giving us seasons.";
  } else if(/how far.*mars/.test(lower)) {
    reply = "Mars is, on average, about 225 million kilometers (140 million miles) from Earth. At closest approach, it’s about 54.6 million km.";
  } else if(/comet|asteroid/.test(lower)) {
    reply = "Comets are icy bodies from the outer solar system with glowing tails. Asteroids are rocky and mostly found in the belt between Mars and Jupiter.";
  } else if(/goodbye|bye|see you/.test(lower)) {
    reply = "Safe travels, explorer! If you have more cosmic questions, I’ll always be here.";
  } else if(/random fact|fun fact|interesting/.test(lower)) {
    const facts = [
      "Did you know? Neutron stars spin up to 600 times per second.",
      "A spoonful of a neutron star would weigh about a billion tons on Earth.",
      "There are more stars in the universe than grains of sand on all Earth's beaches.",
      "Venus is the hottest planet in our solar system, not Mercury.",
      "Jupiter’s Great Red Spot is a giant storm bigger than Earth."
    ];
    reply = facts[Math.floor(Math.random()*facts.length)];
  } else if(/who.*created|made you/.test(lower)) {
    reply = "I was created by a developer inspired by the wonders of space and AI!";
  } else if(/help|what can you do/.test(lower)) {
    reply = "I can answer questions about space, science, and the universe. Try asking me about planets, stars, black holes, or anything cosmic!";
  } else {
    // If nothing matches, give a generic but helpful answer
    const generic = [
      "That's fascinating! Can you tell me more, or ask about a space topic?",
      "Space is full of mysteries. Try asking about planets, stars, or black holes!",
      "If you want a cosmic fact, just say 'fun fact'.",
      "Exploring the universe is always exciting! What else would you like to know?"
    ];
    reply = generic[Math.floor(Math.random()*generic.length)];
  }
  let chat = getChat();
  chat.push({role:"ai", text:reply});
  saveChat(chat);
  showChat();
  speak(reply);
}

// --- Space BG Animation: stars, twinkling, planets, comets ---
const bg = document.getElementById('spaceBg'), ctx = bg.getContext('2d');
let stars = [], planets = [], comets = [];
function resizeSpaceBg() { bg.width = window.innerWidth; bg.height = window.innerHeight; }
function makeSpace() {
  // Stars
  stars = [];
  for (let i=0;i<150;++i) {
    stars.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      r: Math.random()*1.1 + 0.4,
      tw: Math.random()*2*Math.PI,
      s: Math.random()*0.7 + 0.5
    });
  }
  // Planets
  planets = [
    {x:110, y:window.innerHeight-170, r:60, color:"#2c5fff", ring:true, alpha:0.38},
    {x:window.innerWidth-90, y:window.innerHeight-60, r:36, color:"#e8c57e", ring:false, alpha:0.23},
    {x:window.innerWidth*0.50, y:80, r:49, color:"#ba55d3", ring:true, alpha:0.19}
  ];
  // Comets
  comets = [];
  for (let i=0;i<2;++i) comets.push({
    x: Math.random()*window.innerWidth,
    y: Math.random()*window.innerHeight*0.5,
    vx: 2.2+Math.random()*0.7,
    vy: 0.6+Math.random()*0.4,
    tail: Math.random()*36+60,
    t: Math.random()*5000
  });
}
function drawSpace() {
  ctx.clearRect(0,0,bg.width,bg.height);
  // Stars
  let t = Date.now()/1200;
  for (let s of stars) {
    let alpha = 0.58 + 0.35*Math.abs(Math.cos(t*0.7+s.tw));
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r+s.s*Math.abs(Math.sin(t+s.tw)),0,2*Math.PI);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 8+10*alpha;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  // Planets
  for (let p of planets) {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,2*Math.PI);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 26;
    ctx.fill();
    ctx.shadowBlur = 0;
    if (p.ring) {
      ctx.globalAlpha = p.alpha*0.9;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r+13, p.r*0.43, Math.PI/5, 0, 2*Math.PI);
      ctx.strokeStyle = "#8ecaff";
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    ctx.restore();
  }
  // Comets
  for (let c of comets) {
    ctx.save();
    let grad = ctx.createLinearGradient(c.x-c.tail, c.y-c.tail*0.3, c.x, c.y);
    grad.addColorStop(0,"rgba(255,255,255,0)");
    grad.addColorStop(1,"rgba(255,255,255,0.85)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(c.x-c.tail, c.y-c.tail*0.3);
    ctx.lineTo(c.x, c.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(c.x, c.y, 5, 0, 2*Math.PI);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();
    c.x += c.vx; c.y += c.vy; c.t += 1.5;
    if (c.x > bg.width+60 || c.y > bg.height+60) {
      c.x = -30; c.y = Math.random()*window.innerHeight*0.5; c.t = 0;
    }
  }
  requestAnimationFrame(drawSpace);
}
window.addEventListener('resize', ()=>{resizeSpaceBg(); makeSpace();});
resizeSpaceBg(); makeSpace(); drawSpace();

// --- INIT ---
goHome(); // show homepage first
if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = ()=>{};

// Make navigation functions global for inline onclick in HTML
window.goToLogin = goToLogin;
window.goHome = goHome;

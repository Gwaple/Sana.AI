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
  document.getElementById('welcome').textContent = "Hello, " + u + "!";
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
  document.getElementById('authArea').style.display = "";
  document.getElementById('aiApp').style.display = "none";
}
function setMsg(id, msg, ok) {
  let el = document.getElementById(id);
  el.textContent = msg;
  el.style.color = ok ? "#388e3c" : "#b22222";
}

// --- AI Chat Logic (demo: echo + fun effect) ---
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
    div.innerHTML = `<div class="bubble">${msg.role==='ai' ? "🤖 " : ""}${msg.text}</div>`;
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
  setTimeout(()=>aiRespond(msg), 600);
}
function aiRespond(userMsg) {
  // Fun AI effect: reply with a random "AI personality"
  const funReplies = [
    "Interesting question! Here's a fun fact: Honey never spoils. 🍯",
    "I'm an AI, but I love learning new things. Ask me anything!",
    "Let me think... 🤔 Okay, here's my answer:",
    "Great question! The answer is probably 42. 😉",
    "Did you know? Octopuses have three hearts! 🐙",
    "AI says: Stay curious, friend!"
  ];
  let reply;
  if(/hello|hi|hey/i.test(userMsg)) reply = "Hello! How can I assist you today?";
  else if(/name/i.test(userMsg)) reply = "I'm your AI assistant. You can name me anything you like!";
  else if(/weather/i.test(userMsg)) reply = "I can't check real weather yet, but I hope it's sunny where you are!";
  else reply = funReplies[Math.floor(Math.random()*funReplies.length)];
  let chat = getChat();
  chat.push({role:"ai", text:reply});
  saveChat(chat);
  showChat();
}

// --- BG Animation (colorful floating blobs) ---
const bg = document.getElementById('bgAnim'), ctx = bg.getContext('2d');
let blobs = [];
function resizeAnimBg() { bg.width = window.innerWidth; bg.height = window.innerHeight; }
function makeBlobs() {
  blobs = [];
  const palette = [
    "#ffe066", "#b8f2e6", "#fcbaff", "#caffbf", "#ffd6a5", "#d0cfff"
  ];
  for (let i=0;i<12;++i) {
    blobs.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      r: 60+Math.random()*120,
      color: palette[Math.floor(Math.random()*palette.length)],
      dx: (Math.random()*2-1)*0.4, dy: (Math.random()*2-1)*0.32,
      t: Math.random()*Math.PI*2
    });
  }
}
function drawBlobs() {
  ctx.clearRect(0,0,bg.width,bg.height);
  blobs.forEach(b => {
    ctx.save();
    ctx.globalAlpha = 0.17+0.13*Math.sin(Date.now()/850+b.t);
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, 2*Math.PI);
    ctx.fillStyle = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.restore();
    b.x += b.dx; b.y += b.dy;
    b.t += 0.005;
    if (b.x < -b.r) b.x = bg.width+b.r;
    if (b.x > bg.width+b.r) b.x = -b.r;
    if (b.y < -b.r) b.y = bg.height+b.r;
    if (b.y > bg.height+b.r) b.y = -b.r;
  });
  requestAnimationFrame(drawBlobs);
}
window.addEventListener('resize', ()=>{resizeAnimBg(); makeBlobs();});
resizeAnimBg(); makeBlobs(); drawBlobs();

// --- INIT ---
showLogin();
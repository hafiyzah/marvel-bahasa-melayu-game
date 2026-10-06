const CHARACTERS = [
  { id:"katahero", name:"KataHero", title:"Kenali Kata", icon:"🧠", color:"#4f8cff", emoji:"🦸" },
  { id:"maksi", name:"Maksi", title:"Padankan Makna", icon:"🧩", color:"#ff9f43", emoji:"🧩" },
  { id:"lompi", name:"Lompi", title:"Teng-Teng Bahasa", icon:"🦘", color:"#54c78a", emoji:"🦘" },
  { id:"brax", name:"Brax", title:"Slice Makna", icon:"💥", color:"#ff637d", emoji:"💥" },
  { id:"miko", name:"Miko", title:"Micro Meaning", icon:"🔍", color:"#9b7cff", emoji:"🔍" },
  { id:"zappo", name:"Zappo", title:"Thunder Hands", icon:"⚡", color:"#f4c542", emoji:"⚡" }

   


const CHARACTER_IMAGES = {
  katahero: "assets/characters/katahero.png",
  maksi: "assets/characters/maksi.png",
  lompi: "assets/characters/lompi.png",
  brax: "assets/characters/brax.png",
  miko: "assets/characters/miko.png",
  zappo: "assets/characters/zappo.png"
};

const characterImages = {};

Object.entries(CHARACTER_IMAGES).forEach(([id, src]) => {
  const img = new Image();
  img.src = src;
  characterImages[id] = img;
});

const MISSIONS = [
  {
    id:"company", name:"Syarikat", icon:"🏢", char:"katahero", title:"Kenali Kata",
    x:.18, y:.27, color:"#7bb7ff",
    story:"KataHero perlukan bantuan kamu mengenal maksud kosa kata. Pilih jawapan yang paling tepat.",
    questions:[
      {q:"Apakah maksud perkataan “gigih”?", opts:["Mudah berputus asa","Tekun dan bersungguh-sungguh","Suka bermain","Berasa mengantuk"], a:1, explain:"Gigih bermaksud tekun dan bersungguh-sungguh dalam melakukan sesuatu."}
    ]
  },
  {
    id:"house", name:"Rumah", icon:"🏠", char:"maksi", title:"Padankan Makna",
    x:.38, y:.21, color:"#ffc86b",
    story:"Maksi sudah mengumpulkan beberapa perkataan. Padankan perkataan dengan makna yang betul.",
    questions:[
      {q:"“Lapang” dalam ayat “Dada ibu terasa lapang” bermaksud…", opts:["Sempit","Tenang dan lega","Bising","Gelap"], a:1, explain:"Dalam konteks ini, lapang bermaksud tenang atau lega."}
    ]
  },
  {
    id:"school", name:"Sekolah", icon:"🏫", char:"lompi", title:"Teng-Teng Bahasa",
    x:.60, y:.25, color:"#77d6a1",
    story:"Lompi melompat dari satu petak ke petak lain. Jawab soalan untuk membuka laluan seterusnya.",
    questions:[
      {q:"Pilih perkataan yang paling hampir maksudnya dengan “cerdas”.", opts:["Bijak","Lambat","Lemah","Malas"], a:0, explain:"Cerdas mempunyai maksud yang hampir sama dengan bijak."}
    ]
  },
  {
    id:"restaurant", name:"Restoran", icon:"🍽️", char:"brax", title:"Slice Makna",
    x:.80, y:.38, color:"#ff9e8d",
    story:"Brax menjaga restoran. Bantu dia memahami maksud perkataan berdasarkan situasi.",
    questions:[
      {q:"“Lazat” paling sesuai digunakan untuk menggambarkan…", opts:["Makanan yang sedap","Cuaca yang panas","Bilik yang luas","Bunyi yang kuat"], a:0, explain:"Lazat merujuk kepada makanan atau minuman yang sedap."}
    ]
  },
  {
    id:"shop", name:"Kedai", icon:"🛍️", char:"miko", title:"Micro Meaning",
    x:.74, y:.70, color:"#c09bff",
    story:"Miko mencari makna tersembunyi dalam konteks. Perhatikan ayat sebelum memilih jawapan.",
    questions:[
      {q:"“Aiman ringan tulang membantu ibunya.” Apakah maksud “ringan tulang”?", opts:["Mempunyai tulang yang kecil","Suka membantu","Tidak mahu bekerja","Suka tidur"], a:1, explain:"Dalam konteks ayat ini, “ringan tulang” ialah simpulan bahasa yang bermaksud suka membantu atau rajin bekerja."}
    ]
  },
  {
    id:"bank", name:"Bank", icon:"🏦", char:"zappo", title:"Thunder Hands",
    x:.43, y:.73, color:"#ffe06a",
    story:"Ini cabaran akhir! Zappo menguji pemahaman kamu tentang makna kosa kata.",
    questions:[
      {q:"Apakah maksud “murah hati”?", opts:["Suka membeli barang murah","Suka menolong dan pemurah","Tidak mempunyai wang","Suka menyimpan barang"], a:1, explain:"Murah hati bermaksud pemurah dan suka memberikan pertolongan atau sesuatu kepada orang lain."}
    ]
  }
];

const state = {
  name:"",
  character: CHARACTERS[0],
  lives:3, xp:0, coins:0, badges:0,
  unlocked:1, currentMission:null,
  questionIndex:0, answered:false,
  player:{x:0,y:0,targetX:null,targetY:null,moving:false}
};

const $ = id => document.getElementById(id);

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $(id).classList.add("active");
}

function speak(text){
  if (!$("audioSetting").checked || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ms-MY"; u.rate = .92;
  speechSynthesis.speak(u);
}

function openAccessibility(){ $("accessibilityModal").classList.remove("hidden"); }
function closeAccessibility(){ $("accessibilityModal").classList.add("hidden"); }

function renderCharacters(){
  $("characterGrid").innerHTML = CHARACTERS.map((c,i)=>`
    <button class="character-card ${i===0?"selected":""}" data-id="${c.id}">
      <div class="char-art"><img src="${CHARACTER_IMAGES[c.id]}" alt="${c.name}"></div>
      <strong>${c.name}</strong>
      <small>${c.title}</small>
    </button>
  `).join("");
  document.querySelectorAll(".character-card").forEach(btn=>{
    btn.addEventListener("click",()=>{
      document.querySelectorAll(".character-card").forEach(x=>x.classList.remove("selected"));
      btn.classList.add("selected");
      state.character = CHARACTERS.find(c=>c.id===btn.dataset.id);
    });
  });
}

function startGame(){
  state.name = $("playerName").value.trim() || "Pengembara";
  $("hudName").textContent = state.name;
  $("hudAvatar").innerHTML = `<img src="${CHARACTER_IMAGES[state.character.id]}" alt="${state.character.name}">`;
  $("lives").textContent = state.lives;
  $("xp").textContent = state.xp;
  $("coins").textContent = state.coins;
  $("badges").textContent = state.badges;
  showScreen("mapScreen");
  resizeCanvas();
  resetPlayer();
  requestAnimationFrame(gameLoop);
}

const canvas = $("gameCanvas");
const ctx = canvas.getContext("2d");
let W=1000,H=650;
let lastTime=0;
let dpr=window.devicePixelRatio||1;

function resizeCanvas(){
  const rect = canvas.getBoundingClientRect();
  W = Math.max(700, rect.width);
  H = Math.max(500, rect.height);
  dpr=window.devicePixelRatio||1;
  canvas.width=W*dpr; canvas.height=H*dpr;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  resetPlayer();
}
window.addEventListener("resize", resizeCanvas);

function worldPoint(m){ return {x:m.x*W, y:m.y*H}; }

function resetPlayer(){
  state.player.x=W*.08; state.player.y=H*.78;
  state.player.targetX=null; state.player.targetY=null; state.player.moving=false;
}

function drawCity(){
  // sky / grass
  ctx.fillStyle="#9edcf0"; ctx.fillRect(0,0,W,H);
  ctx.fillStyle="#9bd6a4"; ctx.fillRect(0,H*.30,W,H*.70);

  // clouds
  drawCloud(W*.12,H*.10,1.0); drawCloud(W*.72,H*.12,.8); drawCloud(W*.52,H*.04,.55);

  // roads
  ctx.fillStyle="#8b929c";
  ctx.fillRect(0,H*.46,W,H*.17);
  ctx.fillRect(W*.27,0,W*.16,H);
  ctx.beginPath(); ctx.moveTo(W*.08,H); ctx.lineTo(W*.48,H*.52); ctx.lineTo(W*.94,H); ctx.lineTo(W,H); ctx.lineTo(W*.56,H*.52); ctx.lineTo(W*.12,H); ctx.closePath(); ctx.fill();

  // road markings
  ctx.strokeStyle="#f8e99b"; ctx.lineWidth=5; ctx.setLineDash([25,22]);
  ctx.beginPath(); ctx.moveTo(0,H*.545); ctx.lineTo(W,H*.545); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W*.35,0); ctx.lineTo(W*.35,H); ctx.stroke();
  ctx.setLineDash([]);

  // park
  roundRect(ctx,W*.03,H*.06,W*.20,H*.22,25,"#71c98c");
  for(let i=0;i<7;i++) drawTree(W*(.06+i*.025), H*(.11+(i%2)*.08), .8);

  // buildings
  MISSIONS.forEach((m,i)=>{
    const p=worldPoint(m);
    drawBuilding(p.x,p.y,m);
  });

  // decorative houses
  drawSmallHouse(W*.05,H*.72);
  drawSmallHouse(W*.82,H*.12);
  drawSmallHouse(W*.87,H*.67);

  // start plaza
  ctx.fillStyle="#fff7cf";
  ctx.beginPath(); ctx.arc(W*.08,H*.78,55,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#6d7480"; ctx.font="800 13px Nunito"; ctx.textAlign="center";
  ctx.fillText("MULA",W*.08,H*.78+72);
}

function drawCloud(x,y,s){
  ctx.fillStyle="rgba(255,255,255,.86)";
  ctx.beginPath(); ctx.arc(x,y,18*s,0,Math.PI*2); ctx.arc(x+24*s,y-7*s,25*s,0,Math.PI*2); ctx.arc(x+54*s,y,17*s,0,Math.PI*2); ctx.fill();
}
function drawTree(x,y,s){
  ctx.fillStyle="#65a86f"; ctx.beginPath(); ctx.arc(x,y,16*s,0,Math.PI*2); ctx.arc(x+12*s,y+3*s,13*s,0,Math.PI*2); ctx.fill();
  ctx.fillStyle="#8b5a3c"; ctx.fillRect(x-3*s,y+10*s,6*s,18*s);
}
function drawSmallHouse(x,y){
  ctx.fillStyle="#f3a36b"; ctx.fillRect(x,y,75,55);
  ctx.fillStyle="#df5d61"; ctx.beginPath(); ctx.moveTo(x-8,y); ctx.lineTo(x+37,y-38); ctx.lineTo(x+83,y); ctx.closePath(); ctx.fill();
  ctx.fillStyle="#a9d9f4"; ctx.fillRect(x+12,y+15,18,18); ctx.fillRect(x+45,y+15,18,18);
}
function drawBuilding(x,y,m){
  const bw=108,bh=86;
  ctx.save();
  ctx.shadowColor="rgba(0,0,0,.15)"; ctx.shadowBlur=12; ctx.shadowOffsetY=8;
  roundRect(ctx,x-bw/2,y-bh/2,bw,bh,16,m.color);
  ctx.restore();
  ctx.fillStyle="rgba(255,255,255,.9)";
  ctx.fillRect(x-33,y-15,66,42);
  ctx.fillStyle="#526071";
  ctx.fillRect(x-21,y-4,14,13); ctx.fillRect(x+7,y-4,14,13);
  ctx.fillStyle="#fff"; ctx.font="30px sans-serif"; ctx.textAlign="center"; ctx.fillText(m.icon,x,y-30);
  ctx.fillStyle="#182235"; ctx.font="800 12px Nunito"; ctx.fillText(m.name,x,y+57);
  const unlocked = MISSIONS.indexOf(m) < state.unlocked;
  if(!unlocked){
    ctx.fillStyle="rgba(23,32,51,.42)"; ctx.fillRect(x-54,y-43,108,86);
    ctx.font="20px sans-serif"; ctx.fillText("🔒",x,y+8);
  }
}
function roundRect(c,x,y,w,h,r,fill){
  c.beginPath(); c.roundRect(x,y,w,h,r); c.fillStyle=fill; c.fill();
}

function drawPlayer(){
  const p=state.player;
  // shadow
  ctx.fillStyle="rgba(0,0,0,.18)";
  ctx.beginPath(); ctx.ellipse(p.x,p.y+23,18,7,0,0,Math.PI*2); ctx.fill();
  // body
 const img = characterImages[state.character.id];

  if (img && img.complete) {
    const size = 64;
    ctx.drawImage(
      img,
      p.x - size / 2,
      p.y - size + 10,
      size,
      size
    );
  }

  // name tag
  ctx.fillStyle="rgba(255,255,255,.92)";
  const label=state.name;
  ctx.font="800 11px Nunito";
  const tw=ctx.measureText(label).width+14;
  ctx.fillRect(p.x-tw/2,p.y-54,tw,20);
  ctx.fillStyle="#172033";
  ctx.fillText(label,p.x,p.y-40);
}
  ctx.fillStyle="rgba(255,255,255,.92)";
  const label=state.name;
  ctx.font="800 11px Nunito";
  const tw=ctx.measureText(label).width+14;
  ctx.fillRect(p.x-tw/2,p.y-54,tw,20);
  ctx.fillStyle="#172033"; ctx.fillText(label,p.x,p.y-40);
}

function updatePlayer(dt){
  const p=state.player;
  if(p.targetX===null) return;
  const dx=p.targetX-p.x, dy=p.targetY-p.y;
  const dist=Math.hypot(dx,dy);
  if(dist<3){
    p.x=p.targetX; p.y=p.targetY; p.targetX=null; p.targetY=null; p.moving=false;
    checkArrival();
    return;
  }
  const speed=190;
  p.x += dx/dist*speed*dt;
  p.y += dy/dist*speed*dt;
  p.moving=true;
}

function gameLoop(t){
  if(!$("mapScreen").classList.contains("active")) return;
  const dt=Math.min(.05,(t-lastTime)/1000||0); lastTime=t;
  drawCity(); updatePlayer(dt); drawPlayer();
  requestAnimationFrame(gameLoop);
}

function findMissionAt(x,y){
  let best=null,bestDist=Infinity;
  MISSIONS.forEach((m,i)=>{
    const p=worldPoint(m); const d=Math.hypot(x-p.x,y-p.y);
    if(d<75 && d<bestDist){best=m;bestDist=d;}
  });
  return best;
}

canvas.addEventListener("click", e=>{
  const rect=canvas.getBoundingClientRect();
  const x=e.clientX-rect.left, y=e.clientY-rect.top;
  const m=findMissionAt(x,y);
  if(!m) return;
  const idx=MISSIONS.indexOf(m);
  if(idx>=state.unlocked){
    showHint("🔒 Selesaikan misi sebelumnya dahulu!");
    speak("Selesaikan misi sebelumnya dahulu.");
    return;
  }
  state.currentMission=m;
  state.player.targetX=m.x*W;
  state.player.targetY=m.y*H+58;
  showHint(`${m.icon} Menuju ${m.name}...`);
  speak(`Menuju ${m.name}`);
});

function checkArrival(){
  const m=state.currentMission;
  if(!m) return;
  hideHint();
  setTimeout(()=>openMission(m),300);
}

function showHint(t){ $("locationHint").textContent=t; $("locationHint").classList.remove("hidden"); }
function hideHint(){ $("locationHint").classList.add("hidden"); }

function openMission(m){
  $("missionLocation").textContent=m.name.toUpperCase();
  $("missionTitle").textContent=m.title;
  $("missionIcon").textContent=m.icon;
  $("missionCharacter").textContent=CHARACTERS.find(c=>c.id===m.char).emoji;
  $("missionStory").textContent=m.story;
  state.questionIndex=0; state.answered=false;
  renderQuestion();
  showScreen("missionScreen");
  speak(m.story);
}

function renderQuestion(){
  const m=state.currentMission, q=m.questions[state.questionIndex];
  $("questionArea").innerHTML=`
    <div class="question-label">CABARAN ${state.questionIndex+1}</div>
    <div class="question-text">${q.q}</div>
    <div class="options">${q.opts.map((o,i)=>`
      <button class="option" data-option="${i}">${String.fromCharCode(65+i)}. ${o}</button>
    `).join("")}</div>
  `;
  $("missionFeedback").textContent="";
  $("missionFeedback").className="feedback";
  $("nextQuestion").classList.add("hidden");
  document.querySelectorAll(".option").forEach(btn=>btn.addEventListener("click",()=>answerQuestion(Number(btn.dataset.option))));
}

function answerQuestion(choice){
  if(state.answered) return;
  state.answered=true;
  const m=state.currentMission, q=m.questions[state.questionIndex];
  document.querySelectorAll(".option").forEach((btn,i)=>{
    if(i===q.a) btn.classList.add("correct");
    if(i===choice && choice!==q.a) btn.classList.add("wrong");
    btn.disabled=true;
  });
  const fb=$("missionFeedback");
  if(choice===q.a){
    state.xp+=25; state.coins+=10;
    fb.textContent="✅ Betul! "+q.explain;
    fb.className="feedback correct";
    $("nextQuestion").textContent="Selesai & Dapat Ganjaran →";
    $("nextQuestion").classList.remove("hidden");
    speak("Betul! "+q.explain);
  }else{
    state.lives=Math.max(0,state.lives-1);
    $("lives").textContent=state.lives;
    fb.textContent="❌ Belum tepat. "+q.explain;
    fb.className="feedback wrong";
    $("nextQuestion").textContent="Cuba Semula →";
    $("nextQuestion").classList.remove("hidden");
    speak("Belum tepat. "+q.explain);
  }
  $("xp").textContent=state.xp; $("coins").textContent=state.coins;
}

$("nextQuestion").addEventListener("click",()=>{
  if($("nextQuestion").textContent.startsWith("Cuba")){
    renderQuestion(); return;
  }
  completeMission();
});

function completeMission(){
  const idx=MISSIONS.indexOf(state.currentMission);
  state.badges++;
  state.unlocked=Math.max(state.unlocked,idx+2);
  $("badges").textContent=state.badges;
  $("missionNumber").textContent=Math.min(state.unlocked,6);
  $("progressBar").style.width=`${Math.min(state.unlocked,6)/6*100}%`;
  $("rewardText").textContent=`Hebat, ${state.name}! Kamu berjaya menyelesaikan misi ${state.currentMission.title}.`;
  $("rewardModal").classList.remove("hidden");
}

$("continueGame").addEventListener("click",()=>{
  $("rewardModal").classList.add("hidden");
  state.currentMission=null;
  showScreen("mapScreen");
  resizeCanvas();
  resetPlayer();
  requestAnimationFrame(gameLoop);
});

$("backToMap").addEventListener("click",()=>{
  state.currentMission=null;
  showScreen("mapScreen");
  resizeCanvas(); resetPlayer(); requestAnimationFrame(gameLoop);
});

$("startButton").addEventListener("click",startGame);
$("accessibilityButton").addEventListener("click",openAccessibility);
$("mapSettings").addEventListener("click",openAccessibility);
$("closeAccessibility").addEventListener("click",closeAccessibility);
$("saveAccessibility").addEventListener("click",()=>{
  document.body.classList.toggle("large",$("fontSizeSetting").value==="large");
  document.body.classList.toggle("xl",$("fontSizeSetting").value==="xl");
  document.body.classList.toggle("high-contrast",$("contrastSetting").checked);
  document.body.classList.toggle("focus-mode",$("focusSetting").checked);
  closeAccessibility();
});

document.addEventListener("keydown",e=>{
  if(!$("mapScreen").classList.contains("active")) return;
  const p=state.player, step=18;
  if(["ArrowUp","w","W"].includes(e.key)) p.y=Math.max(25,p.y-step);
  if(["ArrowDown","s","S"].includes(e.key)) p.y=Math.min(H-25,p.y+step);
  if(["ArrowLeft","a","A"].includes(e.key)) p.x=Math.max(25,p.x-step);
  if(["ArrowRight","d","D"].includes(e.key)) p.x=Math.min(W-25,p.x+step);
  p.targetX=null; p.targetY=null;
});

renderCharacters();

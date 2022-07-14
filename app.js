// BUILD RANDOM WORLD
const maxWidht = 15;
const minWidht = 5;
const maxHeight = 20;
const minHeight = 10;
const randomWidht =
  Math.floor(Math.random() * (maxWidht - minWidht)) + minWidht;
const randomHeight =
  Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;
let world = [];
world.length = randomHeight;
world.fill([], 0);
for (let i = 0; i < world.length; i++) {
  world[i].length = randomWidht;
}

for (let i = 0; i < world.length; i++) {
  world[i] = [...Array(randomWidht)].map(
    (_, i) => Math.floor(Math.random() * 3) + 1
  );

  world[i][0] = 1;
  world[i][randomWidht - 1] = 1;
}
for (let i = 0; i < world.length; i++) {
  for (let j = 0; j < world[i].length; j++) {
    world[0][j] = 1;
    world[world.length - 1][j] = 1;
  }
}
for (let i = 0; i < world.length; i++) {
  for (let j = 0; j < world[i].length; j++) {
    if (i !== 0 && i !== world.length - 1 && j !== randomWidht - 1) {
      if (j % 2 !== 0) {
        if (world[i][j] === 1) world[i][j] = 2;
      }
    }
  }
}
// console.log(world);

const worldDic = {
  0: 'blank',
  1: 'wall',
  2: 'sushi',
  3: 'onigiri',
};
const drawWorld = () => {
  let output = '';
  for (let i = 0; i < world.length; i++) {
    output += '<div class="row">';
    for (let j = 0; j < world[i].length; j++) {
      output += `<div class="${worldDic[world[i][j]]}"></div>`;
    }
    output += '</div>';
  }
  document.getElementById('world').innerHTML = output;
};
drawWorld();
// MOVING NINJA
let isGameEnd = false;
const ninjaMan = document.getElementById('ninjaman');
const gameScore = document.querySelector('.game-score');
const scoreHead = document.querySelector('.score-head');
const randomAdvice = document.querySelector('.random-advice');
const livesEl = document.querySelector('.lives');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const finalScoreEl = document.querySelector('.final-score');
// Random Advices
const advice = [
  'Eat Shshi First',
  // 'Running Away From Ghosts',
  'Go Fast',
  'Focus',
];
const randomNum = Math.floor(Math.random() * advice.length);
randomAdvice.textContent = advice[randomNum];

const ninjaCords = {
  x: 1,
  y: 1,
};
let { x, y } = ninjaCords;
let score = 0;
let lives = 5;
const drawNinja = () => {
  ninjaMan.style.left = `${x * 40}px`;
  ninjaMan.style.top = `${y * 40}px`;
};
drawNinja();
const moveNinja = (e) => {
  if (e.keyCode === 39) {
    if (world[y][x + 1] !== 1) x++;
  }
  if (e.keyCode === 37) {
    if (world[y][x - 1] !== 1) x--;
  }
  if (e.keyCode === 40) {
    if (world[y + 1][x] !== 1) y++;
  }
  if (e.keyCode === 38) {
    if (world[y - 1][x] !== 1) y--;
  }

  // INCREASE SCORE
  if (world[y][x] !== 0) {
    if (world[y][x] === 3) score += 5;
    else score += 10;
  }
  //   // CHASE NINJAMAN
  //   if (world[y][x] === 4) {
  //     lives--;
  //     livesEl.textContent = lives;
  //   }
  //   // GAME OVER
  //   if (lives < 1) {
  //     showModal('Game Over! ❌');
  //     isGameEnd = true;
  //   }
  gameScore.textContent = score;
  // EAT SUSHI
  world[y][x] = 0;
  //  local storage
  const highScore = localStorage.getItem('ninjaHighScore') || 0;

  if (score > highScore) {
    localStorage.setItem('ninjaHighScore', score);
  }
  // WIN THE GAME
  if (!world.flat(Infinity).includes(2) && !world.flat(Infinity).includes(3)) {
    let msg = '';
    if (score > highScore) msg = 'New High Score 🏆';
    showModal('You Win! 🎉', msg);
    isGameEnd = true;
  }

  // RE-DRAW WORLD && NINJAMAN
  drawWorld();
  drawNinja();
};
document.addEventListener('keydown', moveNinja);

// SHOW MODAL
function showModal(msg, txt = '') {
  overlay.style.display = 'block';
  modal.style.display = 'flex';
  document.querySelector('.modal-title').innerHTML = msg;
  finalScoreEl.innerHTML = `Your score is: ${score}, <a href="">Play Again</a>`;
  document.querySelector('.high-score').textContent = txt;
  document.removeEventListener('keydown', moveNinja);
  // CLOSE MODAL
  document.querySelector('.close-btn').addEventListener('click', () => {
    overlay.style.display = 'none';
    modal.style.display = 'none';
  });
}
// DRAW GHOST
const ghost = document.querySelector('.pinky');
const ghostCords = {
  ghostX: 1,
  ghostY: 1,
};
let { ghostX, ghostY } = ghostCords;
const drawGhost = () => {
  ghost.style.left = `${ghostX * 40}px`;
  ghost.style.top = `${ghostY * 40}px`;
};
drawGhost();
// MOVE GHOST
livesEl.textContent = lives;
const moveGhost = () => {
  const gameInt = setInterval(() => {
    const randomAction = Math.floor(Math.random() * 4);
    const actions = ['ghostX++', 'ghostY++', 'ghostX--', 'ghostY--'];
    const act = actions[randomAction];
    if (act === 'ghostX++' && world[ghostY][ghostX + 1] !== 1) ghostX++;
    if (act === 'ghostY++' && world[ghostY + 1][ghostX] !== 1) ghostY++;
    if (act === 'ghostX--' && world[ghostY][ghostX - 1] !== 1) ghostX--;
    if (act === 'ghostY--' && world[ghostY - 1][ghostX] !== 1) ghostY--;
    if (
      `${ninjaMan.style.left}${ninjaMan.style.top}` ===
        `${ghost.style.left}${ghost.style.top}` &&
      `${ghost.style.left}${ghost.style.top}` !== '40px40px'
    ) {
      lives--;
      livesEl.textContent = lives;
    }
    // GAME OVER
    if (lives < 1) {
      showModal('Game Over! ❌');
      isGameEnd = true;
    }
    if (isGameEnd) clearInterval(gameInt);
    drawGhost();
    drawWorld();
  }, 200);
};
window.addEventListener('load', moveGhost);

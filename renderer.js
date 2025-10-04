const fs = require('fs');
const path = require('path');

const questions = JSON.parse(fs.readFileSync(path.join(__dirname, 'questions.json'), 'utf8'));

let currentIndex = 0;
let score = 0;

const totalEl = document.getElementById('total');
const currentIndexEl = document.getElementById('currentIndex');
const questionText = document.getElementById('questionText');
const optionsEl = document.getElementById('options');
const overlay = document.getElementById('overlay');
const overlayText = document.getElementById('overlay-text');
const overlayContinue = document.getElementById('overlay-continue');
const endScreen = document.getElementById('endScreen');
const endTitle = document.getElementById('endTitle');
const endMessage = document.getElementById('endMessage');
const restartBtn = document.getElementById('restartBtn');
const beanImage = document.getElementById('beanImage');

totalEl.textContent = questions.length;

function renderQuestion() {
  const q = questions[currentIndex];
  currentIndexEl.textContent = currentIndex + 1;
  questionText.textContent = q.question;
  optionsEl.innerHTML = '';

  for (const key of ['A','B','C','D']) {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.option = key;
    btn.innerHTML = `<div class="label">${key}</div><div class="body">${q.options[key]}</div>`;
    btn.addEventListener('click', onChoose);
    optionsEl.appendChild(btn);
  }

  // Reset: Remove animações, volta à imagem normal e opacidade cheia
  beanImage.classList.remove('bean-fail', 'bean-success', 'error-anim');
  beanImage.style.opacity = 1;
  beanImage.src = 'assets/images/bg_kitchen.png';
}

function onChoose(ev) {
  const chosen = ev.currentTarget.dataset.option;
  const q = questions[currentIndex];
  disableOptions(true);

  if (chosen === q.correct_answer) {
    score++;
    beanImage.classList.add('bean-success');
    showExplanation(q.explanation, false);
  } else {
    // Sequência de erro: Muda imagem, adiciona classe para animação, pausa para ela rolar
    beanImage.src = 'assets/images/bg_kitchen_error.png';
    beanImage.classList.add('bean-fail', 'error-anim'); // 'error-anim' triggera o CSS
    
    // Pausa para a animação completa (2s) + um pouquinho extra para transição
    setTimeout(() => {
      showEnd(false, q);
    }, 2200); // Ajuste se quiser mais/menos tempo
  }
}

function disableOptions(state) {
  const all = document.querySelectorAll('.option-btn');
  all.forEach(b => b.disabled = state);
}

function showExplanation(text, autoAdvance = false) {
  overlayText.textContent = text;
  overlay.classList.remove('hidden');
  overlayContinue.focus();

  overlayContinue.onclick = () => {
    overlay.classList.add('hidden');
    currentIndex++;
    if (currentIndex >= questions.length) {
      showEnd(true);
    } else {
      renderQuestion();
    }
  };

  if (autoAdvance) {
    setTimeout(() => overlayContinue.click(), 1400);
  }
}

function showEnd(victory, wrongQuestion = null) {
  endScreen.classList.remove('hidden');
  if (victory) {
    endTitle.textContent = 'Você venceu! 🎉';
    endMessage.textContent = `Acertou ${score} de ${questions.length} perguntas. Parabéns!`;
  } else {
    endTitle.textContent = 'Fim de jogo';
    const correct = wrongQuestion ? wrongQuestion.options[wrongQuestion.correct_answer] : '';
    endMessage.innerHTML = `Você errou. <br/>Resposta correta: <strong>${wrongQuestion.correct_answer}) ${correct}</strong><br/>Acertou ${score} de ${questions.length}.`;
  }
}

restartBtn.onclick = () => {
  currentIndex = 0;
  score = 0;
  endScreen.classList.add('hidden');
  renderQuestion();
};

overlayContinue.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') overlayContinue.click();
});

window.addEventListener('keydown', (e) => {
  // atalhos A-D ou 1-4
  const map = { 'a':'A','b':'B','c':'C','d':'D','1':'A','2':'B','3':'C','4':'D' };
  const key = e.key.toLowerCase();
  if (map[key]) {
    const btn = Array.from(document.querySelectorAll('.option-btn')).find(b => b.dataset.option === map[key]);
    if (btn && !btn.disabled) btn.click();
  }
});

renderQuestion();
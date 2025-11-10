// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations()
  initializeButtons()
  const music = document.getElementById("bg-music")
  initializeGames()
})

// Animações de entrada
function initializeAnimations() {
  const header = document.querySelector("header")
  const homeContent = document.querySelector(".home-content")

  header.style.opacity = "0"
  homeContent.style.opacity = "0"

  setTimeout(() => {
    header.style.transition = "opacity 1s ease-in"
    header.style.opacity = "1"
  }, 100)

  setTimeout(() => {
    homeContent.style.transition = "opacity 1s ease-in"
    homeContent.style.opacity = "1"
  }, 500)
}

// Poema com efeito de digitação
const poema = `
Em uma noite
Céu escuro,
Coração vazio,
Estrelas distantes.

Me vi sem rumo,
Sentado no gramado,
Vazio,
Solitário.

Olho para o lado…
O que procuro?
O que sinto?
O que quero da vida?

Quero uma luz —
A luz que me guie,
Que me faça viver.

De repente, vejo você:
Seu jeitinho,
Seus olhos,
Seu sorriso.

Onde estou?
Estou sonhando?

Em meio à escuridão,
Enxergo a luz,
A esperança.
Finalmente,
Agora tenho um rumo,
Um propósito.

Eu morreria por você,
Lutaria por você,
Faria tudo por você.

Loucura? Pode achar.
Mas faria tudo por você,
Pois você me respeitou,
Me amou,
Não me usou,
Me aceitou
Da forma que sou.

Posso não ser rico,
Nem alto,
Nem forte.
Posso não me encaixar nos padrões.
Mas eu tenho algo
Que muitos nunca vão ter:
A felicidade.

O que está acontecendo?
O que estou falando?
Me sinto tonto,
Perdido…
Perdido em você.

Não tenho palavras.
Acho melhor parar.
Por isso amo você. 💖
`

function initializePoema() {
  let i = 0
  const poemElement = document.getElementById("poema-texto")

  function escreverPoema() {
    if (i < poema.length) {
      const char = poema.charAt(i)
      // Mantém quebras de linha visuais
      poemElement.innerHTML += char === "\n" ? "<br>" : char
      i++
      setTimeout(escreverPoema, 50)
    }
  }

  escreverPoema()
}


// Botões principais
function initializeButtons() {
  const musicBtn = document.getElementById("music-btn")
  const gamesBtn = document.getElementById("games-btn")
  const surpresaBtn = document.getElementById("surpresa-btn")
  const music = document.getElementById("bg-music")

  musicBtn.addEventListener("click", () => {
    if (music.paused) {
      music.play()
      musicBtn.classList.add("playing")
    } else {
      music.pause()
      musicBtn.classList.remove("playing")
    }
  })

  gamesBtn.addEventListener("click", openGamesModal)

  surpresaBtn.addEventListener("click", () => {
    const msg = document.getElementById("mensagem")
    if (msg.style.display === "none") {
      msg.style.display = "block"
      msg.style.opacity = "0"
      setTimeout(() => {
        msg.style.transition = "opacity 0.5s"
        msg.style.opacity = "1"
      }, 50)
    }
  })
}

// Modal de Minijogos
function openGamesModal() {
  const modal = document.getElementById("games-modal");
  modal.classList.add("active");

  // trava a rolagem do corpo
  document.body.style.overflow = "hidden";

  // Fechar modal com X
  const closeBtn = modal.querySelector(".close-modal");
  closeBtn.onclick = () => closeModal(modal);

  // Fechar ao clicar fora
  modal.onclick = (e) => {
    if (e.target === modal) closeModal(modal);
  };

  // Abrir jogo selecionado
  modal.querySelectorAll(".game-card").forEach((card) => {
    card.onclick = () => {
      const game = card.dataset.game;
      closeModal(modal);
      startGame(game);
    };
  });
}

// nova função auxiliar para fechar o modal
function closeModal(modal) {
  modal.classList.remove("active");
  // libera a rolagem novamente
  document.body.style.overflow = "";
}


// Fechar qualquer jogo ativo
function closeGame() {
  document.querySelectorAll(".game-container").forEach((game) => {
    game.style.display = "none"
  })
}

/* ---------- Substitua/adicione isto no script.js (fim do arquivo) ---------- */

function startGame(game) {
  closeGame();
  const gameContainer = document.getElementById(game + "-game");
  if (!gameContainer) return;
  gameContainer.style.display = "block";

  // botão "X" fecha o jogo
  const closeButton = gameContainer.querySelector(".btn-close-game");
  if (closeButton) closeButton.onclick = closeGame;

  // inicializa o jogo específico
  if (game === "memory") initMemoryGame();
  else if (game === "quiz") initQuizGame();
  else if (game === "click") initClickGame();
  else if (game === "urso") initUrsoGame();
}

/* === JOGO DO URSINHO (implementação completa e auto-contida) === */
function initUrsoGame() {
  // elementos
  const container = document.getElementById("game"); // dentro de #urso-game
  const character = document.getElementById("character");
  const obstacle = document.getElementById("obstacle");
  const scoreEl = document.getElementById("score");
  const coinsEl = document.getElementById("coins");
  const gameOverEl = document.getElementById("gameOver");
  const finalScoreEl = document.getElementById("finalScore");
  const winScreen = document.getElementById("winScreen");
  const finalScoreWin = document.getElementById("finalScoreWin");
  const restartBtn = document.getElementById("restart-btn");

  // estado
  let coins = 0;
  let points = 0;
  let gameActive = true;
  let collisionInterval = null;
  let spawnInterval = null;

  // Reset visual/estado inicial
  function resetVisuals() {
    // esconder telas
    gameOverEl.style.display = "none";
    winScreen.style.display = "none";

    // reset counters
    coins = 0;
    points = 0;
    scoreEl.textContent = `Pontos: ${points}`;
    coinsEl.textContent = `Moedas: ${coins}`;

    // limpa moedas existentes
    container.querySelectorAll(".coin").forEach(c => c.remove());

    // restaura animações do obstáculo
    obstacle.style.animation = ""; // volta a aplicar o CSS animation
    obstacle.style.left = ""; // deixa o CSS controlar
    character.classList.remove("jump");
    character.style.bottom = "";
    gameActive = true;
  }

  resetVisuals();

  // Função pulo (usa a classe .jump do CSS que já existe)
  function jump() {
    if (!gameActive) return;
    if (character.classList.contains("jump")) return;
    character.classList.add("jump");
    // remove após duração da animação (0.5s)
    setTimeout(() => character.classList.remove("jump"), 500);
  }

  // Cria uma moeda que atravessa a tela com animation definida no CSS (ursoCoinMove)
  function spawnCoin() {
    if (!gameActive) return;
    const coin = document.createElement("div");
    coin.className = "coin";
    coin.textContent = "🪙";
    // posicione verticalmente aleatório (para pegar com pulo)
    const bottomPx = Math.floor(Math.random() * 90); // 0..90px
    coin.style.bottom = `${20 + bottomPx}px`;
    // garante que a animação comece da direita
    coin.style.left = "100%";
    // usa a keyframes ursoCoinMove (definido no CSS que você já colocou)
    coin.style.animation = "ursoCoinMove 3s linear forwards";
    // quando terminar a animação remove o elemento
    coin.addEventListener("animationend", () => coin.remove());
    container.appendChild(coin);
  }

  // Inicia spawn periódico de moedas
  function startSpawningCoins() {
    spawnInterval = setInterval(spawnCoin, 1200); // a cada 1.2s
    // spawn inicial imediato
    spawnCoin();
  }

  // Para spawn de moedas
  function stopSpawningCoins() {
    if (spawnInterval) {
      clearInterval(spawnInterval);
      spawnInterval = null;
    }
  }

  // Checa colisão entre dois elementos via bounding boxes
  function isColliding(el1, el2) {
    if (!el1 || !el2) return false;
    const r1 = el1.getBoundingClientRect();
    const r2 = el2.getBoundingClientRect();
    return !(
      r1.top > r2.bottom ||
      r1.bottom < r2.top ||
      r1.left > r2.right ||
      r1.right < r2.left
    );
  }

  // Loop que verifica colisões (obstáculo e moedas)
  function startCollisionLoop() {
    collisionInterval = setInterval(() => {
      if (!gameActive) return;

      // colisão com bomba (obstacle)
      if (isColliding(character, obstacle)) {
        // GAME OVER
        gameActive = false;
        obstacle.style.animation = "none";
        stopSpawningCoins();
        clearInterval(collisionInterval);
        finalScoreEl.textContent = `Pontos: ${points} | Moedas: ${coins}`;
        gameOverEl.style.display = "block";
      }

      // colisão com moedas -- iterar moedas existentes
      const coinsEls = container.querySelectorAll(".coin");
      coinsEls.forEach(c => {
        if (isColliding(character, c)) {
          // coletou
          coins += 1;
          points += 10;
          coinsEl.textContent = `Moedas: ${coins}`;
          scoreEl.textContent = `Pontos: ${points}`;
          // animação de coleta (remover)
          c.remove();

          // vitória quando coletar 5 moedas
          if (coins >= 3 && gameActive) {
            gameActive = false;
            obstacle.style.animation = "none";
            stopSpawningCoins();
            clearInterval(collisionInterval);
            finalScoreWin.textContent = `Você fez ${points} pontos e coletou ${coins} moedas!`;
            winScreen.style.display = "block";
          }
        }
      });
    }, 60); // 60ms é responsivo o suficiente
  }

  // Reiniciar jogo (quando clicar em tentar de novo)
  function restartGame() {
    resetVisuals();
    // reinicia animações do obstáculo: reflow forçando restart
    obstacle.style.animation = "none";
    // forçar reflow
    void obstacle.offsetWidth;
    obstacle.style.animation = "ursoObstacleMove 2s linear infinite";
    startSpawningCoins();
    startCollisionLoop();
  }

  // Eventos: clique na área do jogo, mousedown, e teclado
  // clique/tap
  container.onclick = (e) => {
    // se clicar no botão de restart ou telas não dispara pulo
    const target = e.target;
    if (target === restartBtn || target.closest("#gameOver") || target.closest("#winScreen")) return;
    jump();
  };

  // mouse down também funciona
  container.onmousedown = () => jump();

  // teclado: Espaço / ArrowUp / W
  function keyHandler(e) {
    if ([" ", "ArrowUp", "w", "W"].includes(e.key)) {
      e.preventDefault();
      jump();
    }
  }
  document.addEventListener("keydown", keyHandler);

  // botão de restart no Game Over
  if (restartBtn) {
    restartBtn.onclick = () => {
      restartGame();
    };
  }

  // se winScreen tiver botão "EU TE AMO!" — recarregar ou fechar
  const winBtn = winScreen.querySelector("button");
  if (winBtn) {
    winBtn.onclick = () => {
      // fecha o jogo (opcional) — aqui só fecha a tela de vitória
      closeGame();
    };
  }

  // Ao abrir o jogo, iniciar spawn e checagem de colisões
  // Para evitar múltiplas instâncias, limpe intervalos antigos (se existirem)
  if (collisionInterval) { clearInterval(collisionInterval); collisionInterval = null; }
  if (spawnInterval) { clearInterval(spawnInterval); spawnInterval = null; }

  // start
  // Força reinício visível ao abrir
  obstacle.style.animation = "ursoObstacleMove 2s linear infinite";
  startSpawningCoins();
  startCollisionLoop();

  // quando fecha o jogo, limpar tudo
  // override closeGame para também limpar intervalos — mas sem quebrar outras funcionalidades:
  const originalCloseGame = closeGame;
  closeGame = function() {
    // limpa timers locais
    stopSpawningCoins();
    if (collisionInterval) { clearInterval(collisionInterval); collisionInterval = null; }
    // remove event listeners que adicionamos
    container.onclick = null;
    container.onmousedown = null;
    document.removeEventListener("keydown", keyHandler);
    // restaura comportamento original de fechar (esconder containers)
    originalCloseGame();
    // restaura closeGame original na variável global (para não empilhar)
    closeGame = originalCloseGame;
  };
}
/* ---------- fim do trecho a inserir ---------- */


// ==============================
// Jogo da Memória
// ==============================
let memoryFlipped = []
let memoryMatched = 0

function initMemoryGame() {
  const board = document.querySelector(".memory-board")
  board.innerHTML = ""
  memoryFlipped = []
  memoryMatched = 0

  const pairs = ["💕", "🌹", "💌", "🎉", "✨", "🎈"]
  const cards = [...pairs, ...pairs].sort(() => Math.random() - 0.5)

  cards.forEach((card, index) => {
    const button = document.createElement("button")
    button.className = "memory-card"
    button.innerHTML = "❓"
    button.addEventListener("click", () => flipMemoryCard(button, card, index))
    board.appendChild(button)
  })

  document.querySelector(".memory-score span").textContent = "0"
}

function flipMemoryCard(button, card, index) {
  if (memoryFlipped.length < 2 && !button.classList.contains("flipped")) {
    button.classList.add("flipped")
    button.innerHTML = card
    memoryFlipped.push({ button, card, index })

    if (memoryFlipped.length === 2) setTimeout(checkMemoryMatch, 500)
  }
}

function checkMemoryMatch() {
  const [card1, card2] = memoryFlipped

  if (card1.card === card2.card) {
    memoryMatched++
    document.querySelector(".memory-score span").textContent = memoryMatched
    memoryFlipped = []

    if (memoryMatched === 6) {
      setTimeout(() => alert("Parabéns! Você venceu! 🎉"), 300)
    }
  } else {
    card1.button.classList.remove("flipped")
    card2.button.classList.remove("flipped")
    card1.button.innerHTML = "❓"
    card2.button.innerHTML = "❓"
    memoryFlipped = []
  }
}

// ==============================
// Quiz do Amor
// ==============================
const quizQuestions = [
  {
    question: "Qual é a cor mais bonita?",
    options: ["Vermelho ❤️", "Roxo 💜", "Azul 💙", "Verde 💚"],
    correct: 1,
  },
  {
    question: "Quanto você é especial?",
    options: ["Um pouco", "Médio", "Extremamente demais! 💕", "Nada"],
    correct: 2,
  },
  {
    question: "O que você merece?",
    options: ["Felicidade", "Amor", "Sucesso", "Tudo isso junto!"],
    correct: 3,
  },
]

let currentQuestion = 0
let quizScore = 0

function initQuizGame() {
  currentQuestion = 0
  quizScore = 0
  showQuizQuestion()
}

function showQuizQuestion() {
  if (currentQuestion >= quizQuestions.length) {
    alert(`Quiz finalizado! Você acertou ${quizScore}/${quizQuestions.length}! 🎉`)
    closeGame()
    return
  }

  const question = quizQuestions[currentQuestion]
  document.getElementById("quiz-question").innerHTML = question.question

  const optionsContainer = document.querySelector(".quiz-options")
  optionsContainer.innerHTML = ""

  question.options.forEach((option, index) => {
    const button = document.createElement("button")
    button.className = "quiz-option"
    button.innerHTML = option
    button.addEventListener("click", () => answerQuiz(index, question.correct))
    optionsContainer.appendChild(button)
  })
}

function answerQuiz(selected, correct) {
  const options = document.querySelectorAll(".quiz-option")

  options[selected].classList.add(selected === correct ? "correct" : "wrong")
  options[correct].classList.add("correct")

  if (selected === correct) quizScore++

  setTimeout(() => {
    currentQuestion++
    showQuizQuestion()
  }, 1500)
}

// Botão para revelar o poema
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("revelar-poema-btn");
  const poemaBox = document.getElementById("poema-texto");

  if (btn && poemaBox) {
    btn.addEventListener("click", () => {
      btn.style.display = "none"; // esconde o botão
      poemaBox.style.display = "block"; // mostra o poema
      initializePoema(); // inicia a animação de digitação
    });
  }
});



function initializeGames() {
  // nada extra aqui no momento
}

function initializeButtons() {
  const musicBtn = document.getElementById("music-btn")
  const gamesBtn = document.getElementById("games-btn")
  const surpresaBtn = document.getElementById("surpresa-btn")
  const music = document.getElementById("bg-music")

  // === Controle de Volume ===
  const volumeSlider = document.getElementById("volume-slider")
  const volUp = document.getElementById("vol-up")
  const volDown = document.getElementById("vol-down")

  // Volume inicial
  music.volume = parseFloat(volumeSlider.value)

  // Atualiza o volume conforme o slider
  volumeSlider.addEventListener("input", () => {
    music.volume = parseFloat(volumeSlider.value)
  })

  // Botões + e -
  volUp.addEventListener("click", () => {
    let newVol = Math.min(1, music.volume + 0.1)
    music.volume = newVol
    volumeSlider.value = newVol.toFixed(2)
  })

  volDown.addEventListener("click", () => {
    let newVol = Math.max(0, music.volume - 0.1)
    music.volume = newVol
    volumeSlider.value = newVol.toFixed(2)
  })

  // === Botão de Música ===
musicBtn.addEventListener("click", () => {
  const icon = musicBtn.querySelector(".btn-icon")

  if (music.paused) {
    music.play()
    musicBtn.classList.add("playing")
    icon.textContent = "🎵" // ícone quando a música toca
  } else {
    music.pause()
    musicBtn.classList.remove("playing")
    icon.textContent = "🔇" // ícone quando a música pausa
  }
})


  // === Botão de Minijogos ===
  gamesBtn.addEventListener("click", openGamesModal)

  // === Botão de Surpresa ===
  surpresaBtn.addEventListener("click", () => {
    const msg = document.getElementById("mensagem")
    if (msg.style.display === "none") {
      msg.style.display = "block"
      msg.style.opacity = "0"
      setTimeout(() => {
        msg.style.transition = "opacity 0.5s"
        msg.style.opacity = "1"
      }, 50)
    }
  })
}

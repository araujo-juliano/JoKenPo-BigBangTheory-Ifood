const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById('score_points')
  },
  cardSprites: {
    avatar: document.getElementById('card-image'),
    name: document.getElementById('card-name'),
    type: document.getElementById('card-type')
  },
  fieldCards: {
    player: document.getElementById('player-field-card'),
    computer: document.getElementById('computer-field-card')
  },
  playerSides: {
    player1: 'player-cards',
    player1BOX: document.querySelector('#player-cards'),
    computer: 'computer-cards',
    computerBOX: document.querySelector('#computer-cards')
  },
  actions: {
    button: document.getElementById('next-duel')
  }
}

const pathImages = './src/assets/icons/'
const cardData = [
  {
    id: 0,
    name: 'Sheldon',
    type: 'Spock',
    img: `${pathImages}sheldon.jpg`,
    WinOf: [3, 4],
    LoseOf: [1, 2]
  },
  {
    id: 1,
    name: 'Leonard',
    type: 'Lagarto',
    img: `${pathImages}leonard.jpg`,
    WinOf: [0, 2],
    LoseOf: [3, 4]
  },
  {
    id: 2,
    name: 'Penny',
    type: 'Papel',
    img: `${pathImages}penny.jpg`,
    WinOf: [3, 0],
    LoseOf: [1, 4]
  },
  {
    id: 3,
    name: 'Howard',
    type: 'Pedra',
    img: `${pathImages}howard.jpg`,
    WinOf: [1, 4],
    LoseOf: [2, 0]
  },
  {
    id: 4,
    name: 'Raj',
    type: 'Tesoura',
    img: `${pathImages}raj.jpg`,
    WinOf: [1, 2],
    LoseOf: [0, 3]
  }
]

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length)
  return cardData[randomIndex].id
}

async function createCardImage(idCard, fieldSide) {
  const cardImage = document.createElement('img')
  cardImage.setAttribute('height', '100px')
  cardImage.setAttribute('src', './src/assets/icons/back.jpg')
  cardImage.setAttribute('data-id', idCard)
  cardImage.classList.add('card')

  if (fieldSide === state.playerSides.player1) {
    cardImage.addEventListener('click', () => {
      setCardsField(cardImage.getAttribute('data-id'))
    })

    cardImage.addEventListener('mouseover', () => {
      drawSelectCard(idCard)
    })
  }

  return cardImage
}

async function setCardsField(cardId) {
  await removeAllCardsImages()

  let computerCardId = await getRandomCardId()

  await showHiddenCardFieldImage(true)

  await hiddenCardDetails()

  await drawCardsInfield(cardId, computerCardId)

  let duelResults = await checkDuelResults(cardId, computerCardId)

  await updateScore()
  await drawButton(duelResults)
}

async function drawCardsInfield(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img
  state.fieldCards.computer.src = cardData[computerCardId].img
}

async function showHiddenCardFieldImage(value) {
  if (value === true) {
    state.fieldCards.player.style.display = 'block'
    state.fieldCards.computer.style.display = 'block'
  }
  if (value === false) {
    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'
  }
}

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = ''
  state.cardSprites.name.innerText = ''
  state.cardSprites.type.innerText = ''
}

async function drawButton(text) {
  state.actions.button.innerText = text
  state.actions.button.style.display = 'block'
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = 'EMPATE'
  let playerCard = cardData[playerCardId]

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = 'VENCEU'
    state.score.playerScore++
  }

  if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = 'PERDEU'
    state.score.computerScore++
  }

  await playAudio(duelResults)
  return duelResults
}

async function removeAllCardsImages() {
  let { computerBOX, player1BOX } = state.playerSides

  let imgElements = computerBOX.querySelectorAll('img')
  imgElements.forEach(img => img.remove())

  imgElements = player1BOX.querySelectorAll('img')
  imgElements.forEach(img => img.remove())
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img
  state.cardSprites.name.innerText = cardData[index].name
  state.cardSprites.type.innerText = 'Attribute : ' + cardData[index].type
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId()
    const cardImage = await createCardImage(randomIdCard, fieldSide)

    document.getElementById(fieldSide).appendChild(cardImage)
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = ''
  state.actions.button.style.display = 'none'
  state.fieldCards.player.style.display = 'none'
  state.fieldCards.computer.style.display = 'none'

  init()
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audio/${status}.mp3`)

  audio.play()
}

function init() {
  showHiddenCardFieldImage(false)
  drawCards(5, state.playerSides.player1)
  drawCards(5, state.playerSides.computer)

  const bgm = document.getElementById('bgm')
  bgm.volume = 0.1
  bgm.play()
}
init()

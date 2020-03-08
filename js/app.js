//function to be able to collapse and show menu options
function menu() {
  const menu = document.querySelector(".navigation");

  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
}

//variables that hold html tags that are used to display content
const cards = document.querySelectorAll('.mem-card');
const wonGame = document.querySelector(".won-game");
const boardGame = document.querySelector(".show-game");
const scorePanel = document.querySelector(".score-panel");
const star = document.querySelectorAll('.fa-star');
const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const scoreList = document.getElementById('highScoreList');

// array of cards - 16;
let cardSelection = [
  "tree.png",
  "camera.png",
  "coffee.png",
  "dog.png",
  "film.png",
  "gym.png",
  "hamburger.png",
  "home.png",
  "plane.png",
  "star-wars.png",
  "ballons.png",
  "camp.png",
  "cards.png",
  "not-found.png",
  "skate.png",
  "time.png"
];

//Array of incorrect messages
let tryAgain = ["nope.png", "oops.png", "to-bad.png"];
//Array of correct messages
let correct = ["nice.png", "great.png", "yay.png"];

//function that returns control variables
function initControls() {
  return {
    flipCard: false,
    lockBoard: false,
    frtCard: null,
    sndCard: null,
    startTime: null,
  }
}

//function that returns time variables
function initTime() {
  return {
    seconds: 0,
    minutes: 0,
    displaySec: 0,
    displayMin: 0,
    firstTimeClicked: 0
  }
}

//function that returns score variables
function initScore() {
  return {
    moves: 0,
    finalPnt: 'moves',
    fnlScore: 0,
    cardsMatched: 0,
    starPoints: 3,
    secFinal: 0,
    minFinal: 0,
  }
}

//applied functions to variables
let controls = initControls();
let watch = initTime();
let scoreCard = initScore();

//holds variables and calls functions to reset or set
function init() {

  controls = initControls();
  watch = initTime();
  scoreCard = initScore();

  drawleaderBoard();
  drawScoreBoard(true);
  shuffleDeck();
}

//Giving evenlisteners to the cards
for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", flipCard);
}

//function to check if image already in game board array
function cardExists(cards, card) {
  for (i in cards) {
    if (card === cards[i]) {
      console.log("found");
      return true;
    }
  }
  return false;
}

//function to get random cards into the game board
function getRandomCards() {

  let newCards = [];
  //get 8 unique cards from cardSelection array!
  while (newCards.length < 8) {
    let randCard = Math.floor(Math.random() * 16);
    let newCard = "img/" + cardSelection[randCard];
    console.log(newCard);

    if (!(cardExists(newCards, newCard))) {
      newCards.push(newCard);
    }
  }
  return newCards;
}

// function to get random values for the position of the cards
function randomValues() {

  let randNum1 = 0;
  let randNum2 = 0;

  while (randNum1 === randNum2) {
    randNum1 = Math.floor(Math.random() * 17);
    randNum2 = Math.floor(Math.random() * 17);
  }

  return { x: randNum1, y: randNum2 };
}

//function to shuffle Deck of cards
function shuffleDeck() {

  let newCards = getRandomCards();

  //adding random images from the newCards array to the game board
  for (let i = 0; i < newCards.length; i++) {
    cards[i + i].children[0].src = newCards[i];
    cards[i + i + 1].children[0].src = newCards[i];
  }

  //position randomly in the board game
  let card1 = null;
  for (let i = 0; i < cards.length; i++) {

    let num = randomValues();
    let num1 = num.x;
    let num2 = num.y;

    card1 = cards[num1];
    cards[num1] = cards[num2];
    cards[num2] = card1;
    document.querySelector(".board-game").appendChild(card1);
  }
}

//function for flipping cards
function flipCard() {
  if (controls.lockBoard) {
    return;
  }
  //add the flip class when clicked on a card
  this.classList.toggle('flip');

  if (!controls.flipCard) {
    //flip first card
    controls.flipCard = true;
    controls.frtCard = this;

    //variable to check when was the first click
    watch.firstTimeClicked += 1;

    //start time when clicking a card for the firstTime
    if (watch.firstTimeClicked === 1) {
      controls.startTime = window.setInterval(stopWatch, 1000);
    }

  } else {
    //flip second card
    controls.flipCard = false;
    controls.sndCard = this;

    //check if the cards match
    matchingCards();
  }
}

//Matching Cards
function matchingCards() {
  const nicePop = document.getElementById('correct');
  const oopsPop = document.getElementById('uncorrect');
  const card1 = controls.frtCard.dataset.image;
  const card2 = controls.sndCard.dataset.image;

  //get a random number for an index for the tryAgain and correct array
  let goodOrBad = Math.floor(Math.random() * 3);

  //if cards match enter and do the following...
  if (card1 === card2) {

    //remove event listeners from both selected cards
    controls.frtCard.removeEventListener('click', flipCard);
    controls.sndCard.removeEventListener('click', flipCard);

    //wait 50 milliseconds before displaying correct message
    setTimeout(function () {
      nicePop.src = "img/" + correct[goodOrBad];
      nicePop.style.display = "block";
    }, 500);

    //wait 1 second before removing correct message
    setTimeout(function () {
      nicePop.style.display = "none";
    }, 1000);

    //calling functions
    displayScore();
    movesCount();
  } else {
    controls.lockBoard = true;
    //wait 50 milliseconds before displaying try again message
    setTimeout(function () {
      oopsPop.src = "img/" + tryAgain[goodOrBad];
      oopsPop.style.display = "block";
    }, 500);
    //after wait 1 second before removing message
    setTimeout(function () {
      oopsPop.style.display = "none";
    }, 1000);

    //calling function
    movesCount();

    //wait for 1.3 seconds before removing the flip class 
    setTimeout(function () {
      controls.frtCard.classList.remove('flip');
      controls.sndCard.classList.remove('flip');
      controls.lockBoard = false;
    }, 1300);
  }
}


//counting how many moves + how many stars
function movesCount() {

  //everytime user clicks on a card increase moves
  scoreCard.moves += 1;
  scoreCard.finalPnt = scoreCard.moves;
  document.getElementById('points').innerHTML = "Moves: " + scoreCard.moves;

  //if statement to remove star at a certain move count
  if (scoreCard.moves === 15) {
    star[2].classList.add('fa-star-o');
    star[2].classList.remove('fa-star');
    scoreCard.starPoints = 2;
  }
  if (scoreCard.moves === 17) {
    star[1].classList.add('fa-star-o');
    star[1].classList.remove('fa-star');
    scoreCard.starPoints = 1;
  }
  if (scoreCard.moves === 20) {
    star[0].classList.add('fa-star-o');
    star[0].classList.remove('fa-star');
    scoreCard.starPoints = 0;
  }
}

//stopWatch function
function stopWatch() {

  //this variable will start when clicked on first time
  watch.seconds++;

  //logic to determine when to increment next value
  if (watch.seconds / 60 === 1) {
    watch.seconds = 0;
    watch.minutes++;
  }

  if (watch.seconds < 10) {
    watch.displaySec = "0" + watch.seconds.toString();
  }
  else {
    watch.displaySec = watch.seconds;
  }

  if (watch.seconds < 10) {
    watch.displayMin = "0" + watch.minutes.toString();
  }
  else {
    watch.displayMin = watch.minutes;
  }

  //display time
  document.getElementById('time').innerHTML = watch.displayMin + "min" + " : " + watch.displaySec + "sec";

}

//set or reset values of the game
function drawScoreBoard(isReset) {

  if (isReset) {
    console.log("Reset");
    scorePanel.style.display = "";
    boardGame.style.display = "";
    wonGame.style.display = "";

    document.getElementById('star-point').innerHTML = "Star(s): ";
    document.getElementById('final-moves').innerHTML = "Moves: ";
    document.getElementById('final-time').innerHTML = "";
    document.getElementById('final-score').innerHTML = "Final Score: ";

    document.getElementById('time').innerHTML = "00 min" + " : " + "00 sec";
    document.getElementById('points').innerHTML = "Moves: 0";

    watch.minutes = 0;
    watch.seconds = 0;
    scoreCard.moves = 0;
    scoreCard.cardsMatched = 0;

    for (let i = 0; i < cards.length; i++) {
      cards[i].addEventListener("click", flipCard);
      cards[i].classList.remove('flip');
    }

    const putStar = document.querySelectorAll('.fa');

    for (let i = 0; i < putStar.length; i++) {
      putStar[i].classList.add('fa-star');
      putStar[i].classList.remove('fa-star-o');
    }

  }
  else {
    scorePanel.style.display = "none";
    boardGame.style.display = "none";
    wonGame.style.display = "block";
    console.log("Set Values");
    document.getElementById('star-point').innerHTML = "Star(s): " + scoreCard.starPoints + "/3";
    document.getElementById('final-moves').innerHTML = "Moves: " + scoreCard.finalPnt;
    clearInterval(controls.startTime);
    document.getElementById('final-time').innerHTML = watch.displayMin + "min" + " : " + watch.displaySec + "sec";
    document.getElementById('final-score').innerHTML = "Final Score: " + scoreCard.fnlScore + "0";

    localStorage.setItem('mostRecentScore', scoreCard.fnlScore);
  }

}

//Displaying score after all cards have been matched
function displayScore() {

  scoreCard.cardsMatched += 1;

  if (scoreCard.cardsMatched === 8) {

    //100 is just to give a nice presentacion to the player score
    scoreCard.fnlScore = 100 - scoreCard.finalPnt;

    //set the values
    setTimeout(function () {
      drawScoreBoard(false);
    }, 1000);

  }
}

//local storage for highScores
//this enables the save button once user writes a name
username.addEventListener('keyup', () => {
  saveScoreBtn.disabled = !username.value;
});

//function for local storage values
function saveHighScore() {
  getScores();
  saveScore();
  init();
};

function getScores() {

  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  return scores;

}

function saveScore() {

  //holds user name and score name
  let score = {
    name: username.value,
    score: localStorage.getItem('mostRecentScore')
  };

  let scores = getScores();

  //pushes new score to scores
  scores.push(score);


  //organizes scores from highest to lowest
  scores.sort((a, b) => {
    return b.score - a.score;
  });

  return localStorage.setItem('scores', JSON.stringify(scores));
}

//function to display the table 
function drawleaderBoard() {

  //variables that hold scores
  let scores = getScores();

  let newScores = scores.slice(0, 10);

  //loops scores and displays username and scores in the browser
  let table = "";
  for (let i = 0; i < newScores.length; i++) {
    table += "<tr><td>" + [i + 1] + "</td><td>" + newScores[i].name + " </td><td>" + newScores[i].score + "0</td></tr>";
  }

  return scoreList.innerHTML = table;
}

init();
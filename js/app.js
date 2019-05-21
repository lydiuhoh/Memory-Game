const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
const icons = ["fa fa-diamond", "fa fa-paper-plane-o", "fa fa-anchor", "fa fa-bolt", "fa fa-cube",
                "fa fa-leaf", "fa fa-bicycle", "fa fa-bomb"];

const game = {
    cardIcons: icons.concat(icons),
    createCards() {
      game.refreshGame();
      gameBoard = document.querySelector(".deck");
      //shuffle the cards
      let shuffledDeck = shuffle(game.cardIcons);
      //create HTML for the cards
      for (let i = 0; i < shuffledDeck.length; i++) {
        let card = document.createElement("li");
        card.innerHTML= `<i class="${shuffledDeck[i]}"></i>`;
        card.classList.add("card");
        //display the cards
        gameBoard.appendChild(card);
      }
      //open and show cards
      document.querySelector(".deck").addEventListener("click", function(evt) {
        
        if (evt.target.className === "card") {
          evt.target.classList.add("open", "show");
          game.currentCards.push(evt.target);
          if (game.currentCards.length === 1){
            moveCounter();
          }
          if (game.currentCards.length === 2) {
            removeStars();
            let allCards = document.querySelectorAll(".card");
            allCards.forEach (card => { card.classList.add("no-click")});
            
            /*last card opened does NOT match 2nd to last card opened*/
            let firstCard = game.currentCards[0];
            let secondCard = game.currentCards[1];

            let firstIconName = game.currentCards[0].firstChild.classList[1];
            let secondIconName = game.currentCards[1].firstChild.classList[1];

            sleep(300).then(() => {
              // CASE: Cards don't match
              if ( firstIconName !== secondIconName) {
                //remove last two cards added to open cards
                firstCard.classList.remove("open", "show");
                secondCard.classList.remove("open", "show");
              }
              // CASE: Cards match
              else {
                game.openCards.push(firstCard);
                game.openCards.push(secondCard);
                firstCard.classList.add("match");
                secondCard.classList.add("match");
              }
              game.currentCards.pop();
              game.currentCards.pop();
              allCards.forEach (card => { card.classList.remove("no-click")});
              if (game.openCards.length === 16) {
               winner();
              }
            })
          } 
        }
        
      });
    },
    moves: 0,   
    openCards: [],
    currentCards: [],
    refreshGame(){
      //ensures modal is closed
      let modal = document.getElementById("myModal");
      modal.style.display = "none";
      //reset openCards and moves
      game.openCards=[];
      game.moves=0;
      let counter = document.querySelector(".moves");
      counter.innerHTML = game.moves;
      //reset current cards
      game.currentCards=[];
      //reset timer each new game
      let timer = document.getElementById("timer");
      timer.innerHTML = "0 mins 0 secs";
      clearInterval(interval);
      //clear gameBoard each new game
      let gameBoard = document.querySelector(".deck");
      while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
      }
      //reset stars each new game
      let scorePanel = document.querySelector(".score-panel");
      scorePanel.removeChild(scorePanel.firstElementChild);
      console.log(scorePanel);
      let starsList = document.createElement("ul");
      starsList.classList.add("stars");
      starsList.innerHTML= 
        `<li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>
        <li><i class="fa fa-star"></i></li>`;
      scorePanel.prepend(starsList);
      
    }
  };

//game timer

let second = 0, minute = 0;
let timer = document.getElementById("timer");
let interval;
function startTimer(){

    interval = setInterval(function(){
        timer.innerHTML = minute+" mins " + second + " secs";
        second++;
        if(second == 60){
            minute++;
            second = 0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}

//move counter
function moveCounter(){
  game.moves++;
  let counter = document.querySelector(".moves");
  counter.innerHTML = game.moves;
  //start timer on first move
  if(game.moves === 1){
      second = 0;
      minute = 0; 
      hour = 0;
      startTimer();
  }
}

//star rating system
function removeStars() {
  if(game.moves === 10){
    let scorePanel = document.querySelector(".stars");
    scorePanel.removeChild(scorePanel.firstElementChild);
    
  }
  if(game.moves === 14){
    let scorePanel = document.querySelector(".stars");
    scorePanel.removeChild(scorePanel.firstElementChild);
  }
  if(game.moves === 20){
    let scorePanel = document.querySelector(".stars");
    scorePanel.removeChild(scorePanel.firstElementChild);
  }
  if(game.moves === 30){
    let scorePanel = document.querySelector(".stars");
    scorePanel.removeChild(scorePanel.firstElementChild);
  }
}


window.onload = game.createCards;
document.getElementById("restart").addEventListener("click", game.createCards);
document.getElementById("play-again").addEventListener("click", game.createCards);
document.getElementById("deck").addEventListener('click', timer);
 
function winner() {
  // Get the modal
  let modal = document.getElementById("myModal");

  // Get the <span> element that closes the modal
  let span = document.getElementsByClassName("close")[0];

  modal.style.display = "block";
  //let modalStars = document.querySelectorAll(".stars li");
  let finalTime = timer.innerHTML;
  let starRating = document.querySelector(".stars").innerHTML;
  //showing move, rating, time on modal
  document.getElementById("modal-moves").innerHTML = game.moves;
  document.getElementById("modal-stars").innerHTML = starRating;
  document.getElementById("modal-time").innerHTML = finalTime;

  //stops timer
  clearInterval(interval);

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle (array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

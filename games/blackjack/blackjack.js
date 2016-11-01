'use strict';

var $theDeck = [];
var $theDeckID = 0;
var cardsUsed = 0;
var dealerValue = 0;
var userValue = 0;
var hiddenCard = '';
var startButton = $('.start').hide();
var playButton = $('.start-play-button').hide();
var dealerSide = $('.dealer-cards');
var potAmount = $('.pot-amount');
var playerSide = $('.player-cards');
var $initialBet = $('.bet-form').hide();
var $hitBtn = $('<button>').text('HIT');
var $stayBtn = $('<button>').text('STAY');

$(function() {
  // Generate a New "Deck" on Page Load
  generateDeck();

  // Starts Process of Start Button
  startButton.on('click', function(event) {
    event.preventDefault();
    clearTable();
    potAmount.append($initialBet);
    $initialBet.show();
    playButton.show();
  });

  // Starts The Game
  playButton.on('click', function() {
    clearTable();
    dealerSide.children().remove();
    playerSide.children().remove();
    potAmount.children().remove();
    drawHands();
    potAmount.append($hitBtn);
    potAmount.append($stayBtn);
    if(userValue === 21) {
      dealerSide.find('img').last().attr('src', hiddenCard);
      alert('BLACKJACK! YOU WIN!');
      resetGame();
    }
    console.log(dealerValue);
  });

  $hitBtn.on('click', function() {
    dealCards(playerSide);
    if(userValue > 21) {
      console.log(userValue);
      alert('BUST, GAME OVER!');
      dealerSide.find('img').last().attr('src', hiddenCard);
      resetGame();
    }
  });

  $stayBtn.on('click', function() {
    dealerSide.find('img').last().attr('src', hiddenCard);
    generateDeck();
    while (dealerValue < 17) {
      dealCards(dealerSide);
    }
    if(dealerValue > 21) {
        alert('DEALER BUST! YOU WIN!');
        resetGame();
    }
    else if(dealerValue > userValue) {
      alert('DEALER WINS!');
      resetGame();
    }
    else {
      alert('YOU BEAT THE DEALER!');
    }
  });

});

function resetGame() {
  $hitBtn.hide();
  $stayBtn.hide();
  var $resetBtn = $('<button>').text('PLAY AGAIN?');
  $resetBtn.show();
  potAmount.append($resetBtn);

  $resetBtn.on('click', function() {
    $theDeck = [];
    $theDeckID = 0;
    cardsUsed = 0;
    dealerValue = 0;
    userValue = 0;
    hiddenCard = '';
    dealerSide.children().remove();
    playerSide.children().remove();
    $resetBtn.hide();
    $hitBtn.show();
    $stayBtn.show();
    drawHands();
  });
}

function generateDeck() {
  var $newDeck = $.getJSON('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6');

  $newDeck.done(function(data) {
    if($newDeck.status === '200') {
      return;
    }
    else {
      $theDeckID = data.deck_id;
      var $allCards = $.getJSON('https://deckofcardsapi.com/api/deck/' + data.deck_id + '/draw/?count=12');

      $allCards.done(function(newData) {
        if($allCards.status === '200') {
          console.log('wat');
          return;
        }
        else {
          for(var i = 0; i < 12; i++) {
            var allCardsObj = {};
            if(newData.cards[i].value === 'KING' || newData.cards[i].value === 'QUEEN' || newData.cards[i].value === 'JACK') {
              allCardsObj.value = 10;
            }
            else if(newData.cards[i].value === 'ACE') {
              allCardsObj.value = 11;
            }
            else {
              allCardsObj.value = newData.cards[i].value;
            }
            allCardsObj.image = newData.cards[i].image;
            $theDeck.push(allCardsObj);
          }
          startButton.show();
        }
      });
    }
  });
}

function drawHands() {

  for(var i = 0; i < 4; i++) {
    var cardImage = $('<img>').attr('src', $theDeck[i].image);
    if(i % 2 !== 0) {
      if(i === 3) {
        cardImage.attr('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/208px-Card_back_01.svg.png');
        cardImage.prop('height', '314');
        cardImage.prop('width', '226');
        dealerSide.append(cardImage);
        hiddenCard = $theDeck[i].image;
        dealerValue += parseInt($theDeck[i].value);
        cardsUsed++;
      }
      else {
        dealerSide.append(cardImage);
        dealerValue += parseInt($theDeck[i].value);
        cardsUsed++;
      }
    }
    else {
      playerSide.append(cardImage);
      userValue += parseInt($theDeck[i].value);
      cardsUsed++;
    }
  }
  console.log(userValue);
}

function dealCards(side) {
  for(var i = cardsUsed; i < (cardsUsed + 1); i++) {
    var cardImage = $('<img>').attr('src', $theDeck[i].image);
    side.append(cardImage);
    if(side === playerSide) {
      userValue += parseInt($theDeck[i].value);
    }
    else {
      dealerValue += parseInt($theDeck[i].value);
    }
  }
  cardsUsed++;
}

function clearTable() {
  dealerSide.children().hide();
  potAmount.children().hide();
  playerSide.children().hide();
}

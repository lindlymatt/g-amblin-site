'use strict';

/* Steps:
      1. Load Partials per Page (Rules, Bet, Game).
      2. Display Information & Organization.
      3. Add Game Functionality.
        3.1. Use Promises to work w/ Card Loading.
        3.2. Check if you win immediately (blackjack).
        3.3. No need to check if dealer wins immediately.
        3.4. Display winning message after "stay" pressed.
        3.5. Compare values, if same and dealer above 17, call a "push".
      4. Allow "Replay" through Refactored/Reusable Code.
      5. Change localStorage bet every run-through.
*/

var theDeck = null;
var playerScore = 0;
var dealerScore = 0;
var hiddenCard = '';
var hiddenValue = 0;
var playerHand = [];
var dealerHand = [];
var playerCards = $('.player-cards');
var dealerCards = $('.dealer-cards');
var playerScoreDis = $('#player-score');
var dealerScoreDis = $('#dealer-score');
var hitButton = $('#hit-button');
var stayButton = $('#stay-button');

$(function() {
  // Generate Initial Hands
  generateDeck().then(data => {
    theDeck = data;
    drawCards(theDeck, 1).then(data => displayCard(data, dealerCards));
    drawCards(theDeck, 1).then(data => displayCard(data, playerCards));
    drawCards(theDeck, 1).then(data => displayCard(data, dealerCards));
    drawCards(theDeck, 1).then(data => displayCard(data, playerCards));
  });

  // Hit Button Functionality
  hitButton.on('click', hitPlayerCard);

  // Stay Button Functionality
  stayButton.on('click', function() {
    dealerCards.children().last().attr('src', hiddenCard);
    dealerScore += parseInt(hiddenValue);
    updateValues(dealerScore);

    hitDealerCard();
  });
});

function generateDeck() {
  return  $.getJSON('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6');
}

function drawCards(deck, num) {
  return $.getJSON('https://deckofcardsapi.com/api/deck/' + deck.deck_id + '/draw/?count=' + num);
}

function hitPlayerCard() {
  return drawCards(theDeck, 1).then(data => displayCard(data, playerCards));
}

function hitDealerCard() {
  if (dealerScore < 17) {
    drawCards(theDeck, 1).then(data => {
      displayCard(data, dealerCards);
      hitDealerCard();
    });
  }
}

function displayCard(data, side) {
    var $img = $('<img>');
    var cardVal = data.cards[0].value;
    if(dealerCards.children().length === 1 && side === dealerCards) {
      if(cardVal === "JACK" || cardVal === "QUEEN" || cardVal === "KING") {
        hiddenValue = 10;
        dealerHand.push(hiddenValue);
      }
      else if(cardVal === "ACE") {
        hiddenValue = 11;
        dealerHand.push('ACE');
      }
      else {
        hiddenValue = data.cards[0].value;
        dealerHand.push(hiddenValue);
      }
      hiddenCard = data.cards[0].image;
      $img.attr('src', 'images/back-of-card.jpg');
      $img.attr('height', '175px');
      side.append($img);
    }
    else {
      grabValues(data.cards[0], side);
      $img.attr('src',data.cards[0].image);
      $img.attr('height', '175px');
      side.append($img);
    }
}

function grabValues(card, side) {
  if(side === playerCards) {
    if(card.value === "KING" || card.value === "QUEEN" || card.value === "JACK") {
      playerHand.push(10);
      playerScore += 10;
      updateValues(playerScore);
    }
    else if(card.value === "ACE") {
      playerHand.push('ACE');
      playerScore += 11;
      updateValues(playerScore);
    }
    else {
      playerHand.push(card.value);
      playerScore += parseInt(card.value);
      updateValues(playerScore);
    }
  }
  else {
    if(card.value === "KING" || card.value === "QUEEN" || card.value === "JACK") {
      dealerHand.push(10);
      dealerScore += 10;
      updateValues(dealerScore);
    }
    else if(card.value === "ACE") {
      dealerHand.push('ACE');
      dealerScore += 11;
      updateValues(dealerScore);
    }
    else {
      dealerHand.push(card.value);
      dealerScore += parseInt(card.value);
      updateValues(dealerScore);
    }
  }
}

function testAce(hand) {
  if(hand === playerHand) {
    for(let i = 0; i < hand.length; i++) {
      if(hand[i] === 'ACE') {
        if((playerScore - 11) < 21) {
          playerScore = (playerScore - 11) + 1;
          playerHand[i] = 1;
          updateValues(playerScore);
          break;
        }
        else {
          playerScoreDis.text(playerScore);
          bustedHand(playerCards);
        }
      }
    }
    updateValues(playerScore);
  }
  else {
    for(let i = 0; i < hand.length; i++) {
      if(hand[i] === 'ACE') {
        if((dealerScore - 11) < 21) {
          dealerScore = (dealerScore - 11) + 1;
          dealerHand[i] = 1;
          updateValues(dealerScore);
          break;
        }
        else {
          dealerScoreDis.text(dealerScore);
          bustedHand(dealerCards);
        }
      }
      else {
        updateValues(dealerScore);
      }
    }
    updateValues(dealerScore);
  }
}

function updateValues(score) {
  console.log('Dealer Score: ' + dealerScore);
  console.log('Player Score: ' + playerScore);
  console.log('Dealer Hand: ' + dealerHand);
  console.log('Player Hand: ' + playerHand);

  if(score === playerScore) {
    if(playerScore > 21) {
      testAce(playerHand);
    }
    else {
      playerScoreDis.text(score);
    }
  }
  else {
    if(dealerCards.children().length === 2 && score === playerScore) {
      dealerScoreDis.text(score);
    }
    if(dealerScore > 21) {
      testAce(dealerHand);
    }
    else {
      dealerScoreDis.text(score);
    }
  }
}

function bustedHand(side) {
  console.log('sup');
}

function pushedHands() {
  console.log('no');
}

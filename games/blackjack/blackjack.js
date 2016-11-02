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

var thePotText = $('.pot-text');
var thePot = parseInt(thePlayerBet) * 2;
var theDeck = null;
var playerScore = 0;
var dealerScore = 0;
var hiddenCard = '';
var hiddenValue = 0;
var playerHand = [];
var dealerHand = [];
var dClicked = false;
var pClicked = false;
var playerCards = $('.player-cards');
var dealerCards = $('.dealer-cards');
var playerScoreDis = $('#player-score');
var dealerScoreDis = $('#dealer-score');
var hitButton = $('#hit-button');
var stayButton = $('#stay-button');

$(function() {

  // Shows Accurate Bet
  thePotText.text('$' + thePot);

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
    dClicked = true;
    hitButton.hide();
    dealerCards.children().last().attr('src', hiddenCard);
    // dealerScore += parseInt(hiddenValue);
    updateValues(dealerScore);
    hitDealerCard();
    dealerScoreDis.text(dealerScore);

    if(dealerScore === playerScore) {
      pushedHands();
    }
    // else if(playerScore > dealerScore) {
    //   alert('Player wins!');
    // }
    // else {
    //   alert('Dealer wins!');
    // }
    setTimeout(testWinner, 1000);
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
  pClicked = true;
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
      }
      else if(cardVal === "ACE") {
        hiddenValue = 11;
      }
      else {
        hiddenValue = parseInt(cardVal);
      }
      hiddenCard = data.cards[0].image;
      $img.attr('src', 'images/back-of-card.jpg');
      $img.attr('height', '150px');
      side.append($img);
      grabValues(data.cards[0], side);
    }
    else {
      $img.attr('src', data.cards[0].image);
      $img.attr('height', '150px');
      side.append($img);
      grabValues(data.cards[0], side);
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
    if(hand.includes('ACE')) {
      var pIndexOf = hand.indexOf('ACE');
      if((playerScore - 11) < 21) {
        playerScore = (playerScore - 11) + 1;
        playerHand[pIndexOf] = 1;
        updateValues(playerScore);
      }
      else {
        playerScoreDis.text(playerScore);
        bustedHand(playerCards);
      }
    }
    else {
      playerScoreDis.text(playerScore);
      bustedHand(playerCards);
    }
  }
  else {
    if(hand.includes('ACE')) {
      var dIndexOf = hand.indexOf('ACE');
      if((dealerScore - 11) < 22) {
        dealerScore = (dealerScore - 11) + 1;
        dealerHand[dIndexOf] = 1;
        updateValues(dealerScore);
      }
      else {
        dealerScoreDis.text(dealerScore);
        bustedHand(dealerCards);
      }
    }
    else {
      dealerScoreDis.text(dealerScore);
      bustedHand(dealerCards);
    }
  }
}

function updateValues(score) {
  if(score === playerScore) {
    if(playerScore > 21 && playerCards.children().length > 1) {
      testAce(playerHand);
    }
    else if(playerScore === 21 && pClicked === false) {
      hitButton.hide();
      playerScoreDis.text(playerScore);
      dealerCards.children().last().attr('src', hiddenCard);
      dealerScoreDis.text(dealerScore);
      var $bustScreen = $('#expanded');
      var $bustText = $('.first-line');
      $bustScreen.fadeIn(200).delay(3000).fadeOut(200);
      $bustText.text('BLACKJACK! YOU WIN ' + (thePot / 2) + ' TOKENS!');
      resetGame();
    }
    else {
      playerScoreDis.text(score);
    }
  }
  else {
    if(dealerScore > 21) {
      testAce(dealerHand);
    }
    else if(dClicked === false && dealerScore !== 22) {
      console.log(dealerScore);
      dealerScoreDis.text(score - hiddenValue);
    }
    else if(dClicked === true && dealerScore === playerScore) {
      dealerScoreDis.text(score);
      pushedHands();
    }
    else {
      dealerScoreDis.text(score);
    }
  }
}

// Load the "Bust" Screen
function bustedHand(side) {
  // dealerScore = 0;
  var $bustScreen = $('#expanded');
  var $bustText = $('.first-line');
  var $bustText2 = $('.second-line');
  $bustScreen.fadeIn(200).delay(3000).fadeOut(200);

  if(side === playerCards) {
    dealerCards.children().last().attr('src', hiddenCard);
    dealerScoreDis.text(dealerScore);
    $bustText.text('YOU BUSTED!');
    $bustText2.text('YOU LOSE ' + (thePot / 2) + ' TOKENS!');
  }
  else {
    $bustText.text('DEALER BUST!');
    $bustText2.text('YOU WIN ' + (thePot / 2) + ' TOKENS!');
  }

  resetGame();
}

// Load the "Push" Screen
function pushedHands() {
  if(dealerScore > 16 && dealerScore < 22) {
    dealerScoreDis.text(dealerScore);
    var $bustScreen = $('#expanded');
    var $bustText = $('.first-line');
    var $bustText2 = $('.second-line');
    $bustScreen.fadeIn(200).delay(3000).fadeOut(200);
    $bustText.text('PUSH, SAME HANDS!');
    $bustText2.text('YOU WIN ' + (parseInt(thePot) / 2) + ' TOKENS!');
    resetGame();
  }
}

function testWinner() {
  var $bustScreen = $('#expanded');
  var $bustText = $('.first-line');
  var $bustText2 = $('.second-line');
  // var $scoresText = $('<div>').append($('<h1>'));
  // $scoresText.first().addId('expanded-text');

  if(playerScore < 22 && playerScore > dealerScore) {
    $bustScreen.fadeIn(200).delay(3000).fadeOut(200);
    $bustText.text('YOU HAVE A HIGHER HAND!');
    $bustText2.text('YOU WIN ' + (thePot / 2) + ' TOKENS!');
    // $scoresText.first().text('DEALER SCORE: ' + dealerScore + ' vs. PLAYER SCORE: ' + playerScore);
    resetGame();
  }
  if(dealerScore < 22 && dealerScore > 16 && dealerScore > playerScore) {
    $bustScreen.fadeIn(200).delay(3000).fadeOut(200);
    $bustText.text('DEALER HAS HIGHER HAND!');
    $bustText2.text('YOU LOSE ' + (thePot / 2) + ' TOKENS!');
    // $scoresText.first().text('DEALER SCORE: ' + dealerScore + ' vs. PLAYER SCORE: ' + playerScore);
    resetGame();
  }
}

function resetGame() {
  var $potText = $('.pot-text');
  var $potHeader = $('.pot-header');
  hitButton.off('click');
  stayButton.off('click');
  hitButton.text('SAME BET').show();
  stayButton.text('NEW BET');
  $potText.text('');
  $potHeader.text('PLAY AGAIN?');

  hitButton.on('click', function() {
    $mainContent.load('partials/game.partial', function() {
      $.getScript('blackjack.js');
    });
  });

  stayButton.on('click', function() {
    $mainContent.load('partials/bet.partial', function() {
      var $playButton = $('#play-button');

      $playButton.on('click', function() {
        thePlayerBet = $('input').val();
        if(thePlayerBet.length < 2 || thePlayerBet === undefined) {
          thePlayerBet.addClass('invalid');
        }
        else {
          $mainContent.load("partials/game.partial", function() {
            $.getScript('blackjack.js');
          });
        }
      });
    });
  });
}

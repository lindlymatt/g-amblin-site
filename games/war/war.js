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
var realPValue = 0;
var realDValue = 0;
var dHiddenCard = '';
var pHiddenCard = '';
var dHiddenValue = 0;
var pHiddenValue = 0;
// var playerHand = [];
// var dealerHand = [];
// var dClicked = false;
// var pClicked = false;
var playerCards = $('.player-cards');
var dealerCards = $('.dealer-cards');
var playerScoreDis = $('#player-score');
var dealerScoreDis = $('#dealer-score');
var warButton = $('#war-button');
var stayButton = $('#stay-button');

$(function() {

  // Shows Accurate Bet
  thePotText.text('$' + thePot);
  stayButton.hide();

  // Generate Initial Hands
  generateDeck().then(data => {
    theDeck = data;
    drawCards(theDeck, 1).then(data => displayCard(data, dealerCards));
    drawCards(theDeck, 1).then(data => displayCard(data, playerCards));
  });

  // Stay Button Functionality
  warButton.on('click', function() {
    // dClicked = true;
    dealerCards.children().last().attr('src', dHiddenCard);
    playerCards.children().last().attr('src', pHiddenCard);
    // updateValues(dealerScore);
    dealerScoreDis.text(dHiddenValue);
    playerScoreDis.text(pHiddenValue);

    setTimeout(testWinner, 500);
  });
});

function generateDeck() {
  return  $.getJSON('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6');
}

function drawCards(deck, num) {
  return $.getJSON('https://deckofcardsapi.com/api/deck/' + deck.deck_id + '/draw/?count=' + num);
}

function gameOfWar() {
  playerCards.children().remove();
  dealerCards.children().remove();
  generateDeck().then(data => {
    theDeck = data;
    drawCards(theDeck, 1).then(data => displayCard(data, dealerCards));
    drawCards(theDeck, 1).then(data => displayCard(data, playerCards));
  });

  warButton.on('click', function() {
    // dClicked = true;
    dealerCards.children().last().attr('src', dHiddenCard);
    playerCards.children().last().attr('src', pHiddenCard);
    // updateValues(dealerScore);
    dealerScoreDis.text(dHiddenValue);
    playerScoreDis.text(pHiddenValue);

    setTimeout(testWinner, 500);
  });
}

// function hitPlayerCard() {
//   return drawCards(theDeck, 1).then(data => displayCard(data, playerCards));
// }

// function hitDealerCard() {
//   if (dealerScore < 17) {
//     drawCards(theDeck, 1).then(data => {
//       displayCard(data, dealerCards);
//       hitDealerCard();
//     });
//   }
// }

function displayCard(data, side) {
    var $img = $('<img>');
    var cardVal = data.cards[0].value;

    if(dealerCards.children().length === 0 && side === dealerCards) {
      dHiddenValue = cardVal;
      dHiddenCard = data.cards[0].image;
      $img.attr('src', 'images/back-of-card.jpg');
      $img.attr('height', '150px');
      side.append($img);
      grabValues(data.cards[0], side);
    }
    else if(playerCards.children().length === 0 && side === playerCards) {
      pHiddenValue = cardVal;
      pHiddenCard = data.cards[0].image;
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
    if(card.value === "ACE") {
      realPValue = 14;
    }
    else if(card.value === "KING") {
      realPValue = 13;
    }
    else if(card.value === "QUEEN") {
      realPValue = 12;
    }
    else if(card.value === "JACK") {
      realPValue = 11;
    }
    else {
      realPValue = card.value;
    }
  }
  else {
    if(card.value === "ACE") {
      realDValue = 14;
    }
    else if(card.value === "KING") {
      realDValue = 13;
    }
    else if(card.value === "QUEEN") {
      realDValue = 12;
    }
    else if(card.value === "JACK") {
      realDValue = 11;
    }
    else {
      realDValue = card.value;
    }
  }
}

function testWinner() {
  var $bustScreen = $('#expanded');
  var $bustText = $('.first-line');
  var $bustText2 = $('.second-line');
  var warButton = $('#war-war-button').hide();
  var warStayButton = $('#war-stay-button').hide();
  var tankPic = $('.tank-pic').hide();
  // var $scoresText = $('<div>').append($('<h1>'));
  // $scoresText.first().addId('expanded-text');

  if(parseInt(realPValue) > parseInt(realDValue)) {
    $bustScreen.fadeIn(200).delay(3000).fadeOut(200);
    $bustText.text('YOU HAVE A HIGHER CARD!');
    $bustText2.text('YOU WIN ' + (thePot / 2) + ' TOKENS!');
    localStorage.setItem('tokens', (parseInt(localStorage.getItem('tokens')) + parseInt(thePot)));
    // $scoresText.first().text('DEALER SCORE: ' + dealerScore + ' vs. PLAYER SCORE: ' + playerScore);
    resetGame();
  }
  else if(parseInt(realPValue) < parseInt(realDValue)) {
      $bustScreen.fadeIn(200).delay(3000).fadeOut(200);
      $bustText.text('DEALER HAS HIGHER CARD!');
      $bustText2.text('YOU LOST YOUR ' + (thePot / 2) + ' TOKENS!');
      // $scoresText.first().text('DEALER SCORE: ' + dealerScore + ' vs. PLAYER SCORE: ' + playerScore);
      resetGame();
  }
  else {
    $bustScreen.css('padding-top', '20px');
    tankPic.show();
    $bustScreen.fadeIn(200);
    warButton.show();
    warStayButton.show();
    $bustText.text('SAME HAND, SHALL WE GENTS?!');
    $bustText2.text('DO NOT BE A SALLY! LET US GO TO WAR!');

    warButton.on('click', function() {
      $bustScreen.css('padding-top', '20%');
      $bustScreen.fadeOut(200);
      gameOfWar();
    });

    warStayButton.on('click', function() {
      $bustScreen.fadeOut(200);
      localStorage.setItem('tokens', (parseInt(localStorage.getItem('tokens')) + parseInt(thePot / 2)));
      resetGame();
    });
  }
}

function resetGame() {
  var $potText = $('.pot-text');
  var $potHeader = $('.pot-header');
  warButton.off('click');
  warButton.text('SAME BET');
  stayButton.text('NEW BET').show();
  $potText.text('');
  $potHeader.text('PLAY AGAIN?');
  console.log(localStorage.getItem('tokens'));

  warButton.on('click', function() {
    if(parseInt(thePlayerBet) <= parseInt(localStorage.getItem('tokens'))) {
      localStorage.setItem('tokens', (parseInt(localStorage.getItem('tokens')) - parseInt(thePlayerBet)));
      console.log(playerTokens);
      $mainContent.load('partials/game.partial', function() {
        $.getScript('war.js');
      });
    }
    else {
      alert('You do not have enough tokens to do the same bet. Taking you to the bet page to continue.');

      $mainContent.load('partials/bet.partial', function() {
        var $playButton = $('#play-button');
        var $inputField = $('input');
        thePlayerBet = 0;

        $playButton.on('click', function() {
          thePlayerBet = $('input').val();
          if(thePlayerBet.length < 3 || thePlayerBet === undefined) {
            $inputField.addClass('invalid');
            $inputField.prop('placeholder', 'Minimum $100 Bet!');
          }
          else if(parseInt(playerTokens) < parseInt(thePlayerBet)) {
            $inputField.addClass('invalid');
            $inputField.prop('placeholder', 'Not enough money!');
            alert('You do not have enough tokens for that.');
          }
          else {
            localStorage.setItem('tokens', (parseInt(playerTokens) - parseInt(thePlayerBet)));
            $mainContent.load("partials/game.partial", function() {
              $.getScript('war.js');
            });
          }
        });
      });

    }
  });

  stayButton.on('click', function() {
    $mainContent.load('partials/bet.partial', function() {
      var $playButton = $('#play-button');
      var $inputField = $('input');
      thePlayerBet = 0;

      $playButton.on('click', function() {
        thePlayerBet = $('input').val();

        if(thePlayerBet.length < 3 || thePlayerBet === undefined) {
          $inputField.addClass('invalid');
          $inputField.prop('placeholder', 'Minimum $100 Bet');
        }
        else if(parseInt(localStorage.getItem('tokens')) < parseInt(thePlayerBet)) {
          $inputField.addClass('invalid');
          $inputField.prop('placeholder', 'Not enough money!');
          alert('You do not have enough tokens for that.');
        }
        else {
          localStorage.setItem('tokens', (parseInt(localStorage.getItem('tokens')) - parseInt(thePlayerBet)));
          $mainContent.load("partials/game.partial", function() {
            $.getScript('blackjack.js');
          });
        }
      });
    });
  });
}

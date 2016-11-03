'use strict';

// Goals:
  // - Load the Rules Partial.
    // - On Button click of the Rules button, load the betting partial.
  // - Load the Betting Partial.
    // - Allow input for tokens from localStorage.
    // - Only allow event handler when tokens input are tokens available.
      // - If tokens not available, output error.
      // - If available, show green, and allow them to proceed.
    // - Allow button press, and allow loading of "game" partial.
    // - Also on button press, load "blackjack.js" script using getScript.

var $mainContent = $('#main-content');
var thePlayerBet = 0;
var playerTokens = localStorage.getItem('tokens');

$(function() {

  $('.the-click').on('click', function() {
    $('.logged-in-click').text(username);
    $('.user-name-nav').text('Welcome, ' + username + '.');
    $('.user-tokens-nav').text('You have: ' + parseInt(localStorage.getItem('tokens')) + ' tokens.');
  });

  $mainContent.load("partials/rules.partial", function() {
    var $betButton = $('#bet-button');
    $betButton.on('click', function() {

      $mainContent.load("partials/bet.partial", function() {
        var $playButton = $('#play-button');
        var $inputField = $('input');

        $playButton.on('click', function() {
          thePlayerBet = $('input').val();
          if(thePlayerBet.length < 3 || thePlayerBet === undefined) {
            $inputField.addClass('invalid');
            $inputField.prop('placeholder', 'Minimum $100 Bet');
          }
          else if(parseInt(playerTokens) < parseInt(thePlayerBet)) {
            $inputField.addClass('invalid');
            $inputField.prop('placeholder', 'Not enough money!');
            alert('You do not have enough tokens for that.');
          }
          else {
            localStorage.setItem('tokens', (playerTokens - thePlayerBet));
            $mainContent.load("partials/game.partial", function() {
              $.getScript('blackjack.js');
            });
          }
        });
      });

    });

  });

});

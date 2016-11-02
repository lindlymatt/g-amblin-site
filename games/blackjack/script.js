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

$(function() {

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
          else {
            $mainContent.load("partials/game.partial", function() {
              $.getScript('blackjack.js');
            });
          }
        });
      });

    });

  });

});

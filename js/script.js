'use strict';

var registerButton = $('#register-button');
// var finalNavCol = $('.final-col');
var signOutBtn = $('.sign-out-btn')
var loggedIn = $('.logged-in');
var username = localStorage.getItem('username');

$(function() {
  loggedIn.hide();

  // NAVIGATION ELEMENTS //
  findUserInStorage();
  var signUpUser = $('#signup_user');
  var signUpPass = $('#signup_pass');
  var confirmButton = $('.confirm-button');

  confirmButton.on('click', function() {
    if(signUpUser.val().length > 0) {
      registerUser(signUpUser.val(), signUpPass.val());
    }
    else {
      signUpUser.addClass('invalid');
    }
  });

  signOutBtn.on('click', function() {
    localStorage.clear();
    location.reload();
  });

  // Game Notices
  var gameNotices = $('.gambling-notice');

  gameNotices.on('mouseenter', function() {
    $(this).parent().children().toggleClass('red-text');
    $(this).parent().children().toggleClass('text-darken-4');
  });
  gameNotices.on('mouseleave', function() {
    $(this).parent().children().toggleClass('red-text');
    $(this).parent().children().toggleClass('text-darken-4');
  });

  // Games Cards
  var gamesCol = $('.game-col');
  var blackjackCard = $('#blackjack').hide();
  var warCard = $('#war').hide();
  var slotsCard = $('#slots').hide();
  var diceCard = $('#dice').hide();
  var sevensCard = $('#sevens').hide();
  var rouletteCard = $('#roulette').hide();
  var mainCard = $('#main-card');


  gamesCol.on('mouseenter', function() {
    // Change Card Color
    $(this).children().toggleClass('deep-orange');
    $(this).children().toggleClass('darken-4');
    // Change Text Color
    $(this).find('h5').toggleClass('grey-text');
    $(this).find('h5').toggleClass('text-darken-1');
    // Show Accurate History Card
    if($(this).find('h5').text() === 'Blackjack') {
      blackjackCard.toggle();
      mainCard.toggle();
    }
    else if($(this).find('h5').text() === 'War') {
      warCard.toggle();
      mainCard.toggle();
    }
    else if($(this).find('h5').text() === 'Slots') {
      slotsCard.toggle();
      mainCard.toggle();
    }
    else if($(this).find('h5').text() === 'Dice') {
      diceCard.toggle();
      mainCard.toggle();

    }
    else if($(this).find('h5').text() === 'Sevens') {
      sevensCard.toggle();
      mainCard.toggle();
    }
    else if($(this).find('h5').text() === 'Roulette') {
      rouletteCard.toggle();
      mainCard.toggle();
    }
  });

  gamesCol.on('mouseleave', function() {
    // Change Card Color
    $(this).children().toggleClass('deep-orange');
    $(this).children().toggleClass('darken-4');
    // Change Text Color
    $(this).find('h5').toggleClass('grey-text');
    $(this).find('h5').toggleClass('text-darken-1');

    if($(this).find('h5').text() === 'Blackjack') {
      blackjackCard.toggle();
      mainCard.toggle();
    }
    else if($(this).find('h5').text() === 'War') {
      warCard.toggle();
      mainCard.toggle();
    }
    else if($(this).find('h5').text() === 'Slots') {
      slotsCard.toggle();
      mainCard.toggle();
    }
    else if($(this).find('h5').text() === 'Dice') {
      diceCard.toggle();
      mainCard.toggle();
    }
    else if($(this).find('h5').text() === 'Sevens') {
      sevensCard.toggle();
      mainCard.toggle();
    }
    else if($(this).find('h5').text() === 'Roulette') {
      rouletteCard.toggle();
      mainCard.toggle();
    }
  });
});

function findUserInStorage() {
  if(username !== null) {
    registerButton.hide();
    loggedIn.show();
    $('.logged-in-click').text(username);
    $('.user-name-nav').text('Welcome, ' + username + '.');
    $('.user-tokens-nav').text('You have: ' + localStorage.getItem('tokens') + ' tokens.');
  }
}

function registerUser(user, pass) {
  localStorage.clear();
  localStorage.setItem('username', user);
  localStorage.setItem('password', pass);
  localStorage.setItem('tokens', 1000);
  location.reload();
}

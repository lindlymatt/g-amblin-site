app.controller('blackjackController', blackjackController);

function blackjackController($scope, cardService, $timeout) {

    $scope.buildDeck = cardService.buildDeck;

    $scope.view = {
        playerHand: {},
        playerBust: false,
        playerBlackjack: false,
        playerCash: 1000,
        dealerHand: {},
        dealerBust: false,
        dealerBlackjack: false,
        showDealerHand: false,
        push: false,
        bettingPhase: true,
        winner: null
    };


    $scope.bet = function() {
        $scope.view.bettingPhase = true;
        $scope.view.winner = null;
        $scope.view.playerBust = false;
        $scope.view.dealerBust = false;
        $scope.view.showDealerHand = false;
        $scope.view.disableControls = false;
        $scope.view.push = false;
        $scope.view.playerHand = {};
        $scope.view.dealerHand = {};
        $scope.view.playerBlackjack = false;
        $scope.view.dealerBlackjack = false;
    }

    $scope.deal = function() {
        $scope.view.savedBet = $scope.view.playerBet;
        $scope.view.deck = $scope.buildDeck();
        $scope.view.deck.shuffle();
        $scope.view.bettingPhase = false;
        $scope.view.playerCash -= $scope.view.playerBet;

        $timeout(function() {
            var deck = $scope.view.deck;
            deck.shuffle();

            // Player's Hand
            $scope.view.playerHand.cards = [deck.cards.pop(), deck.cards.pop()];
            $scope.view.dealerHand.cards = [deck.cards.pop(), deck.cards.pop()];
            $timeout(function() {
                $scope.view.playerHand.value = handValue($scope.view.playerHand);
                if ($scope.view.playerHand.value === 21) {
                    $scope.view.playerBlackjack = true;
                    $scope.view.winner = checkForWinner();
                    $scope.view.playerCash += $scope.view.savedBet * 2.5;
                }

                // Dealer's Hand
                $scope.view.dealerHand.value = partialHandValue($scope.view.dealerHand);
                if ($scope.view.dealerHand.value === 21 && !$scope.view.playerBlackjack) {
                    $scope.view.dealerBlackjack = true;
                    $scope.view.winner = checkForWinner();
                }
            }, 1000);
        }, 1000);
    };

    $scope.hit = function() {
        var deck = $scope.view.deck;
        $scope.view.playerBust = false;
        $scope.view.playerHand.cards.push(deck.cards.pop());
        $scope.view.playerHand.value = handValue($scope.view.playerHand);
        if ($scope.view.playerHand.value > 21) {
            $scope.view.playerBust = true;
            $scope.view.winner = checkForWinner();
        }
    };

    $scope.stand = function() {
        var deck = $scope.view.deck;
        var dealerHand = $scope.view.dealerHand;
        $scope.view.disableControls = true;

        $scope.view.halfFlip = true;

        $timeout(function() {
            $scope.view.halfFlip = false;
            $scope.view.showDealerHand = true;
        }, 500);
        $timeout(function() {
            dealerHand.value = handValue(dealerHand);
            dealerDraw();
        }, 1000);

        function dealerDraw() {
            var dealerAces = false;
            for (var i = 0; i < dealerHand.cards.length; i++) {
                if (dealerHand.cards[i].rank === 'A') {
                    dealerAces = true;
                }
            }
            // dealer must hit soft 17
            if (dealerHand.value < 17 || (dealerHand.value === 17 && dealerAces)) {
                $timeout(function() {
                    dealerHand.cards.push(deck.cards.pop());
                    $timeout(function() {
                        dealerHand.value = handValue(dealerHand);
                        if (dealerHand.value > 21) {
                            $scope.view.dealerBust = true;
                            $scope.view.winner = checkForWinner();
                            if ($scope.view.winner === 'player') {
                                $scope.view.playerCash += $scope.view.savedBet * 2;
                            }
                            if ($scope.view.winner === 'push') {
                                $scope.view.playerCash += $scope.view.savedBet;
                            }
                            return;
                        }
                        dealerDraw();
                    }, 1000);
                }, 1000);
            } else {
                $timeout(function() {
                    $scope.view.winner = checkForWinner();
                    if ($scope.view.winner === 'player') {
                        $scope.view.playerCash += $scope.view.savedBet * 2;
                    }
                    if ($scope.view.winner === 'push') {
                        $scope.view.playerCash += $scope.view.savedBet;
                    }
                }, 1000);
            }
        }
    }



    function checkForWinner() {
        if ($scope.view.playerBust) {
            return 'dealer';
        }
        if ($scope.view.dealerBust) {
            return 'player';
        }
        if ($scope.view.dealerBlackjack) {
            return 'dealer';
        }
        if ($scope.view.playerBlackjack) {
            return 'player';
        }
        if ($scope.view.playerHand.value === $scope.view.dealerHand.value) {
            $scope.view.push = true;
            return 'push';
        }
        if ($scope.view.playerHand.value > $scope.view.dealerHand.value) {
            return 'player';
        }
        if ($scope.view.dealerHand.value > $scope.view.playerHand.value) {
            return 'dealer';
        }
        return 'WTF'
    }

    $scope.collect = function(rank) {
        var array = [];
        if (rank === 'A') {
            return [null];
        }
        if (typeof rank !== 'number') {
            return array;
        }
        for (var i = 0; i < rank; i++) {
            array.push(null);
        }
        return array;
    };

}
blackjackController.$inject = ['$scope', 'cardService', '$timeout'];

// ================
// Helper Functions
// ================
function handValue(hand) {
    var score = hand.cards.reduce(sumCards);
    for (var i = 0; i < hand.cards.length; i++) {
        if (hand.cards[i].rank === 'A' && score > 21) { // correct for aces
            score -= 10;
        }
    }
    return score;
}

function partialHandValue(hand) {
    return cardValue(hand.cards[0]);
}

function sumCards(a, b) {
    return cardValue(a) + cardValue(b);
}

function cardValue(card) {
    if (typeof card.rank === 'number') { // handle non-face cards
        card.value = card.rank;
    } else if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') { // handle face cards
        card.value = 10;
    } else { // handle aces
        card.value = 11;
    }
    return card.value || card; // with more than two cards, total is passed back in as a number
}

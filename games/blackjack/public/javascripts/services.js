app.service('cardService', cardService);

function cardService() {
    var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
    var ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

    this.buildDeck = function() {
        var deck = {
            cards: [],
            shuffle: shuffle
        };
        for (var i = 0; i < suits.length; i++) {
            for (var j = 0; j < ranks.length; j++) {
                deck.cards.push({
                    suit: suits[i],
                    rank: ranks[j]
                });
            }
        }
        return deck;
    };

    function shuffle() {
        var shuffled = [];
        var deck = this.cards;
        while (deck.length > 0) {
            var randomIndex = Math.ceil(Math.random() * deck.length) - 1;
            var shuffleCard = deck[randomIndex];
            shuffled.push(shuffleCard);
            deck.splice(randomIndex, 1);
        }
        this.cards = shuffled;
    }


}

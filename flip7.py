class Flip7:
    def __init__(self):
        self.reset()

    def draw_card(self, card_value: str):
        self.hand.append(card_value)
        self.hand = sorted(self.hand, key=lambda x: (x.isdigit(), int(x) if x.isdigit() else float('inf')))
        self.deck_distribution[card_value] -= 1
        self.total -= 1
        self.update_bust_prob()
    
    # bust on 2 of any number card, not counting special cards
    def update_bust_prob(self):
        self.bust_prob = 0
        for k in self.hand:
            if k.isdigit():
                self.bust_prob += (self.deck_distribution[k] / self.total)
        
    def reset(self):
        self.deck_distribution: dict = {
        "0":1
        }
        special_cards: dict = {
            "f3":3,
            "2c":2,
            "+x":5,
            "x2":1,
            "fr":3,
        }
        for i in range(12):
            self.deck_distribution[f"{i+1}"]=i+1
        self.deck_distribution.update(special_cards)
        self.total = sum(self.deck_distribution.values())
        max = 0
        self.hand = []
        self.bust_prob = 0

    def input_card(self):
        card_value = input("Enter the card value you drew (e.g., 0-12, f3, 2c, +x, x2, fr'): ")
        if card_value in self.deck_distribution and self.deck_distribution[card_value] > 0:
            self.draw_card(card_value)
        elif card_value.lower() == 'a':
            print("Exiting the game. Goodbye!")
            exit()
        elif card_value.lower() == 'r':
            print("Resetting the game.")
            self.reset()
        else:
            print("Invalid card value or card not available in the deck. Please try again. Type A to quit. Type R to reset.")
            self.input_card()
    
    def __str__(self):
        return f"Hand: {self.hand}\nBust Probability on Next Draw: {self.bust_prob:.2f}"

if __name__ == "__main__":
    Flip7_game = Flip7()
    while True:
        print(Flip7_game)
        Flip7_game.input_card()
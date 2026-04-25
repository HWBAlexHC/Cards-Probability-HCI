class Blackjack:
    """
    Blackjack probability helper.
    
    Cards are stored as: '2'..'9', '10' (covers 10/J/Q/K, count = 16), 'A'.
    Bust prob = chance the next single card pushes the hand over 21.
    Win/EV calculations assume the current deck composition stays fixed
    during the recursion (standard "infinite deck during decision" model).
    """
    
    DEALER_HITS_SOFT_17 = False  # set True for H17 tables
    
    def __init__(self):
        self.reset()
    
    # ---------- pure hand-state helpers ----------
    
    @staticmethod
    def _normalize(card: str) -> str:
        c = card.strip().upper()
        return "10" if c in ("J", "Q", "K", "T") else c
    
    @staticmethod
    def hand_value(hand: list) -> int:
        total = sum(11 if c == "A" else int(c) for c in hand)
        aces = sum(1 for c in hand if c == "A")
        while total > 21 and aces > 0:
            total -= 10
            aces -= 1
        return total
    
    @classmethod
    def is_soft(cls, hand: list) -> bool:
        total = sum(11 if c == "A" else int(c) for c in hand)
        aces = sum(1 for c in hand if c == "A")
        while total > 21 and aces > 0:
            total -= 10
            aces -= 1
        return aces > 0
    
    @classmethod
    def is_bust(cls, hand: list) -> bool:
        return cls.hand_value(hand) > 21
    
    @staticmethod
    def _step(total: int, soft: bool, card: str):
        """Add `card` to a (total, soft) hand state, return new (total, soft)."""
        if card == "A":
            if total + 11 <= 21:
                return (total + 11, True)
            new_total = total + 1
            if new_total > 21 and soft:
                new_total -= 10
                soft = False
            return (new_total, soft)
        new_total = total + int(card)
        if new_total > 21 and soft:
            return (new_total - 10, False)
        return (new_total, soft)
    
    # ---------- game state ----------
    
    def reset(self):
        self.deck_distribution = {
            "2": 4, "3": 4, "4": 4, "5": 4, "6": 4,
            "7": 4, "8": 4, "9": 4, "10": 16, "A": 4,
        }
        self.total = sum(self.deck_distribution.values())
        self.hand = []
        self.dealer_card = None
        self.bust_prob = 0.0
    
    def _draw_from_deck(self, card: str):
        if card not in self.deck_distribution or self.deck_distribution[card] <= 0:
            raise ValueError(f"'{card}' not available in deck.")
        self.deck_distribution[card] -= 1
        self.total -= 1
    
    def draw_card(self, card_value: str):
        card = self._normalize(card_value)
        self._draw_from_deck(card)
        self.hand.append(card)
        self.hand = sorted(self.hand, key=lambda x: (x == "A", int(x) if x != "A" else 0))
        self.update_bust_prob()
    
    def set_dealer_card(self, card_value: str):
        card = self._normalize(card_value)
        if self.dealer_card is not None:  # replace, restore previous
            self.deck_distribution[self.dealer_card] += 1
            self.total += 1
        self._draw_from_deck(card)
        self.dealer_card = card
        self.update_bust_prob()
    
    def update_bust_prob(self):
        self.bust_prob = 0.0
        if not self.hand or self.total == 0:
            return
        for card, count in self.deck_distribution.items():
            if count > 0 and self.is_bust(self.hand + [card]):
                self.bust_prob += count / self.total
    
    # ---------- probability analysis ----------
    
    def analyze(self) -> dict:
        if self.dealer_card is None:
            raise ValueError("Dealer card not set.")
        if not self.hand:
            raise ValueError("Player hand is empty.")
        
        deck = self.deck_distribution
        total = self.total
        h17 = self.DEALER_HITS_SOFT_17
        
        # Dealer final-value distribution, memoized on (total, soft)
        d_cache = {}
        def dealer_dist(t, s):
            if (t, s) in d_cache:
                return d_cache[(t, s)]
            if t > 21:
                return {22: 1.0}
            stop = t >= 18 or (t == 17 and not (s and h17))
            if stop:
                return {t: 1.0}
            out = {}
            for c, n in deck.items():
                if n <= 0: continue
                p = n / total
                nt, ns = self._step(t, s, c)
                for v, q in dealer_dist(nt, ns).items():
                    out[v] = out.get(v, 0) + p * q
            d_cache[(t, s)] = out
            return out
        
        d0 = self._step(0, False, self.dealer_card)
        dealer_outcomes = dealer_dist(*d0)
        
        def stand_outcome(p_total):
            if p_total > 21:
                return (0.0, 0.0, 1.0)
            w = ps = l = 0.0
            for v, q in dealer_outcomes.items():
                if v > 21 or v < p_total:   w += q
                elif v == p_total:           ps += q
                else:                        l += q
            return (w, ps, l)
        
        # EV-optimal hit outcome, memoized on (total, soft)
        h_cache = {}
        def hit_outcome(t, s):
            if (t, s) in h_cache:
                return h_cache[(t, s)]
            w = ps = l = 0.0
            for c, n in deck.items():
                if n <= 0: continue
                p = n / total
                nt, ns = self._step(t, s, c)
                if nt > 21:
                    l += p
                    continue
                so = stand_outcome(nt)
                if nt == 21:                # never hit on 21
                    best = so
                else:
                    ho = hit_outcome(nt, ns)
                    best = ho if (ho[0] - ho[2]) > (so[0] - so[2]) else so
                w  += p * best[0]
                ps += p * best[1]
                l  += p * best[2]
            h_cache[(t, s)] = (w, ps, l)
            return (w, ps, l)
        
        pv = self.hand_value(self.hand)
        ps_ = self.is_soft(self.hand)
        s_w, s_p, s_l = stand_outcome(pv)
        if self.is_bust(self.hand):
            h_w, h_p, h_l = (0.0, 0.0, 1.0)
        else:
            h_w, h_p, h_l = hit_outcome(pv, ps_)
        
        s_ev, h_ev = s_w - s_l, h_w - h_l
        return {
            "player_value": pv, "soft": ps_, "dealer_card": self.dealer_card,
            "stand": {"win": s_w, "push": s_p, "loss": s_l, "ev": s_ev},
            "hit":   {"win": h_w, "push": h_p, "loss": h_l, "ev": h_ev},
            "recommend": "HIT" if h_ev > s_ev else "STAND",
        }
    
    # ---------- I/O ----------
    
    def input_card(self):
        cmd = input("Card ('p X' = your card, 'd X' = dealer up, X alone = player; "
                    "X is 2-10/J/Q/K/A. R reset, A quit): ").strip()
        if cmd.lower() == "a":
            print("Goodbye!"); exit()
        if cmd.lower() == "r":
            print("Resetting."); self.reset(); return
        try:
            parts = cmd.split()
            if len(parts) == 2 and parts[0].lower() == "p":
                self.draw_card(parts[1])
            elif len(parts) == 2 and parts[0].lower() == "d":
                self.set_dealer_card(parts[1])
            elif len(parts) == 1:
                self.draw_card(parts[0])
            else:
                raise ValueError("bad input")
        except (ValueError, KeyError) as e:
            print(f"Invalid: {e}. Try again.")
            self.input_card()
    
    def __str__(self):
        if not self.hand:
            return f"Hand: (empty)\nDealer up card: {self.dealer_card or '—'}"
        v = self.hand_value(self.hand)
        soft = " (soft)" if self.is_soft(self.hand) and not self.is_bust(self.hand) else ""
        lines = [
            f"Hand: {self.hand}  total: {v}{soft}",
            f"Dealer up card: {self.dealer_card or '—'}",
            f"Bust prob on next draw: {self.bust_prob:.3f}",
        ]
        if self.dealer_card and not self.is_bust(self.hand):
            r = self.analyze()
            lines += [
                f"Stand → win {r['stand']['win']:.3f}  push {r['stand']['push']:.3f}  "
                f"loss {r['stand']['loss']:.3f}  EV {r['stand']['ev']:+.3f}",
                f"Hit   → win {r['hit']['win']:.3f}  push {r['hit']['push']:.3f}  "
                f"loss {r['hit']['loss']:.3f}  EV {r['hit']['ev']:+.3f}",
                f"Recommend: {r['recommend']}",
            ]
        return "\n".join(lines)


if __name__ == "__main__":
    game = Blackjack()
    while True:
        print()
        print(game)
        game.input_card()
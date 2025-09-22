class Marks:
    def __init__(self,actual_words: list[str],guessed_words: list[str]):
        self.score: int = 0
        self.actual_words = actual_words
        self.guessed_words = guessed_words

    def add_score(self):
        words_comp : dict[str, int] = {}
        for word in self.actual_words:
            words_comp[word] = words_comp.get(word, 0) + 1
        for word in self.guessed_words:
            if word in words_comp and words_comp[word] == 1:
                self.score += 1
    
    def return_score(self) -> int:
        return self.score

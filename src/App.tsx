import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [numbers, setNumbers] = useState<number[]>(Array(9).fill(null)); // Random numbers
  const [guesses, setGuesses] = useState<string[]>(Array(9).fill('')); // Player guesses
  const [results, setResults] = useState<(boolean | null)[]>(Array(9).fill(null)); // Results of the check
  const [correctCount, setCorrectCount] = useState<number>(0); // Counter for correct guesses
  const [attempts, setAttempts] = useState<number>(0); // Counter for attempts
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Generate unique random numbers from 1 to 9
  const generateNumbers = (): void => {
    const newNumbers = shuffleArray(Array.from({ length: 9 }, (_, i) => i + 1));
    setNumbers(newNumbers);
    setGuesses(Array(9).fill(''));
    setResults(Array(9).fill(null));
  };

  // Function to shuffle an array
  const shuffleArray = (array: number[]): number[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Reset statistics
  const resetStats = (): void => {
    setCorrectCount(0);
    setAttempts(0);
  };

  // Validate user inputs
  const checkGuesses = (): void => {
    const newResults = guesses.map((guess, index) => {
      if (guess === '') return false; // Empty fields are considered incorrect
      return Number(guess) === numbers[index];
    });
    setResults(newResults);

    const correct = newResults.filter((res) => res === true).length;
    setCorrectCount(correct);
    setAttempts((prev) => prev + 1);

    // Scroll to results
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="App">
      <h1>Game-casino</h1>
      <button onClick={generateNumbers}>Start</button>
      <button onClick={resetStats}>Reset statistic</button>
      <div className="stats">
        <p>Points guessed: {correctCount} out of 9</p>
        <p>Attempts: {attempts}</p>
      </div>
      <div className="grid" ref={resultRef}>
        {numbers.map((number, index) => (
          <div
            key={index}
            className={`cell ${results[index] === true ? 'correct' : ''} ${results[index] === false ? 'incorrect' : ''}`}
          >
            <input
              type="text"
              value={guesses[index]}
              onChange={(e) => {
                const newGuesses = [...guesses];
                newGuesses[index] = e.target.value.replace(/[^1-9]/g, ''); // Remove invalid characters
                setGuesses(newGuesses);
              }}
            />
            {results[index] !== null && <span className="correct-number">{numbers[index]}</span>}
          </div>
        ))}
      </div>
      <button onClick={checkGuesses}>Check </button>
    </div>
  );
}

export default App;

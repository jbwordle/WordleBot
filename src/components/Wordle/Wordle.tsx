import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { WordleRequest, WordleRequestItem, WordleResponse, fetchWordleResult } from '../../api/api';
import { LetterResponse } from '../../types';
import Guess from './Guess/Guess';
import './Wordle.css';

interface GuessItem {
    guess: string[];
    responses: LetterResponse[];
}

const Wordle = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoadFinished, setIsFirstLoadFinished] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [guesses, setGuesses] = useState<GuessItem[]>([
        { guess: Array(5).fill(''), responses: Array(5).fill('absent') },
    ]);
    const [activeGuessIndex, setActiveGuessIndex] = useState(0);

    const handleUpdateResponse = (guessIndex: number, letterIndex: number, response: LetterResponse) => {
        setGuesses(currentGuesses => currentGuesses.map((item, index) => {
            if (index === guessIndex) {
                const updatedResponses = [...item.responses];
                updatedResponses[letterIndex] = response;
                return { ...item, responses: updatedResponses };
            }
            return item;
        }));
    };

    const handleGuessSubmit = async () => {
        setIsLoading(true);
        setError(null);

        const currentGuess = guesses[activeGuessIndex];
        const { guess, responses } = currentGuess;

        const word = guess.join('');
        const clue = responses.map(response =>
            response === 'correct' ? 'g' :
                response === 'present' ? 'y' :
                    'x'
        ).join('');

        const requestItem: WordleRequestItem = {
            word: word,
            clue: clue
        };

        try {
            const request: WordleRequest = [requestItem];

            const response: WordleResponse = await fetchWordleResult(request);
            console.log("API Response:", response);

            if (response && response.guess) {
                setGuesses([...guesses, { guess: response.guess.split(''), responses: Array(5).fill('absent') }]);
            }

            setActiveGuessIndex(activeGuessIndex + 1);
        }
        catch (error) {
            console.error('Error fetching Wordle result:', error);
            setError('Error fetching Wordle result: ' + error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const fetchFirstWord = async () => {

            setIsLoading(true);
            try {
                const requestItem: WordleRequestItem = {
                    word: 'xxxxx',
                    clue: 'xxxxx'
                };

                const request: WordleRequest = [requestItem];
                const response: WordleResponse = await fetchWordleResult(request);

                if (response && response.guess) {
                    setGuesses(currentGuesses => {
                        const newGuesses = [...currentGuesses];
                        newGuesses[0].guess = response.guess.split('');
                        return newGuesses;
                    });

                    setIsFirstLoadFinished(true);
                }
            } catch (error) {
                console.error('Error fetching the first word:', error);
                setError('Failed to load the first word. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFirstWord();
    }, []);

    return (
        <div id="wordle-container">
            {isLoading && (
                <div id="circular-spinner">
                    <CircularProgress />
                </div>
            )}

            {isFirstLoadFinished && guesses.map((guessData, index) => (
                <Guess
                    key={index}
                    guessNumber={index + 1}
                    guessValue={guessData.guess}
                    responses={guessData.responses}
                    onUpdateResponse={(letterIndex, response) => handleUpdateResponse(index, letterIndex, response)}
                />
            ))}

            {error && <div id="error">
                {error}
            </div>}

            {isFirstLoadFinished &&
                <div id="submit-button">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isLoading || activeGuessIndex >= 5}
                        onClick={handleGuessSubmit}>
                         {(isLoading ? 'Submitting...' : 'Submit')}
                    </Button>
                </div>
            }
        </div>
    );
}

export default Wordle;
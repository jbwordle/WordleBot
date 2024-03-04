import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { WordleRequest, WordleRequestItem, WordleResponse, fetchWordleResult } from '../../api/api';
import { LetterResponse } from '../../types';
import Guess from './Guess/Guess';
import './Wordle.css';

interface GuessItem {
    letter: string[];
    letterResponses: LetterResponse[];
}

const Wordle = () => {
    const absent = 'absent';
    const guessIsAllGreen = 'ggggg';
    const blankRequestItem: WordleRequestItem = {
        word: 'xxxxx',
        clue: 'xxxxx'
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isGameSuccessful, setIsGameSuccessful] = useState(false);
    const [isGameUnsuccessful, setIsGameUnsuccessful] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeGuessIndex, setActiveGuessIndex] = useState(0);

    const wordleHasLoaded = () => {
        return guessItems[0].letter[0].length > 0;
    }

    const [guessItems, setGuessItems] = useState<GuessItem[]>([
        { letter: Array(5).fill(''), letterResponses: Array(5).fill(absent) },
    ]);

    const handleUpdateLetterResponse = (guessIndex: number, letterIndex: number, letterResponse: LetterResponse) => {
        setGuessItems(currentGuessItems => currentGuessItems.map((item, index) => {
            if (index === guessIndex) {
                const updatedLetterResponses = [...item.letterResponses];
                updatedLetterResponses[letterIndex] = letterResponse;
                return { ...item, letterResponses: updatedLetterResponses };
            }
            return item;
        }));
    };

    const handleGuessSubmit = async () => {
        setIsLoading(true);
        setError(null);

        const currentGuessItem = guessItems[activeGuessIndex];
        const { letter, letterResponses } = currentGuessItem;

        const word = letter.join('');
        const clue = letterResponses.map(letterResponse =>
            letterResponse === 'correct' ? 'g' :
                letterResponse === 'present' ? 'y' :
                    'x'
        ).join('');

        if (clue === guessIsAllGreen) {
            setIsGameSuccessful(true);
            setIsLoading(false);
            return;
        }
        else if (guessItems.length === 5) {
            setIsGameUnsuccessful(true);
            setIsLoading(false);
            return;
        }

        const requestItem: WordleRequestItem = {
            word: word,
            clue: clue
        };

        try {
            const request: WordleRequest = [requestItem];

            const apiResponse: WordleResponse = await fetchWordleResult(request);
            console.log("API Response:", apiResponse);

            if (apiResponse && apiResponse.guess) {
                setGuessItems([...guessItems, { letter: apiResponse.guess.split(''), letterResponses: Array(5).fill('absent') }]);
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
                const request: WordleRequest = [blankRequestItem];
                const apiResponse: WordleResponse = await fetchWordleResult(request);
                if (apiResponse && apiResponse.guess) {
                    setGuessItems(currentGuessItems => {
                        const newGuessItems = [...currentGuessItems];
                        newGuessItems[0].letter = apiResponse.guess.split('');
                        return newGuessItems;
                    });
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

            {wordleHasLoaded() && guessItems.map((guessData, index) => (
                <Guess
                    key={index}
                    guessNumber={index + 1}
                    guessValue={guessData.letter}
                    letterResponses={guessData.letterResponses}
                    onUpdateLetterResponse={(letterIndex, letterResponse) => handleUpdateLetterResponse(index, letterIndex, letterResponse)}
                />
            ))}

            {error && <Alert severity="error">{error}</Alert>}

            {isGameSuccessful && <Alert severity="success">
                Yay! All Done
            </Alert>}

            {wordleHasLoaded() && !isGameSuccessful && !isGameUnsuccessful &&
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
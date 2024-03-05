import { Alert } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useRef, useState } from 'react';
import { WordleRequest, WordleRequestItem, WordleResponse, fetchWordleResult } from '../../api/api';
import { LetterResponse } from '../../types';
import Guess from './Guess/Guess';
import './Wordle.css';
import StatusInfoPane from './StatusInfoPane';

interface WordleProps {
    onResetWordle: () => void;
}

interface GuessItem {
    letter: string[];
    letterResponses: LetterResponse[];
}

const Wordle = ({ onResetWordle }: WordleProps) => {
    const absent = 'absent';
    const guessIsAllGreen = 'ggggg';
    const blankRequestItem: WordleRequestItem = {
        word: 'xxxxx',
        clue: 'xxxxx'
    };

    const [isLoading, setIsLoading] = useState(false);
    const [isFirstLoadFinished, setIsFirstLoadFinished] = useState(false);
    const [isGameSuccessful, setIsGameSuccessful] = useState(false);
    const [isGameUnsuccessful, setIsGameUnsuccessful] = useState(false);
    const [isFailedOnFirstLoad, setIsFailedOnFirstLoad] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [detailedErrorMsg, setDetailedErrorMsg] = useState<string | null>(null);
    const [activeGuessIndex, setActiveGuessIndex] = useState(0);

    const [guessItems, setGuessItems] = useState<GuessItem[]>([
        { letter: Array(5).fill(''), letterResponses: Array(5).fill(absent) },
    ]);

    const handleUpdateLetterResponse = (guessIndex: number, letterIndex: number, letterResponse: LetterResponse) => {
        if (guessIndex === activeGuessIndex && !isLoading) {
            setGuessItems(currentGuessItems => currentGuessItems.map((item, index) => {
                if (index === guessIndex) {
                    const updatedLetterResponses = [...item.letterResponses];
                    updatedLetterResponses[letterIndex] = letterResponse;
                    return { ...item, letterResponses: updatedLetterResponses };
                }
                return item;
            }));
        }
    };

    const handleGuessSubmit = async () => {
        setErrorMsg(null);
        setDetailedErrorMsg(null);
        setIsLoading(true);

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

        if (guessItems.length < 5) {
            const requestItem: WordleRequestItem = {
                word: word,
                clue: clue
            };

            try {
                const request: WordleRequest = [requestItem];
                const apiResponse: WordleResponse = await fetchWordleResult(request);

                if (apiResponse && apiResponse.guess) {
                    setGuessItems([...guessItems, { letter: apiResponse.guess.split(''), letterResponses: Array(5).fill('absent') }]);
                    setActiveGuessIndex(activeGuessIndex + 1);
                }
            }
            catch (error) {
                setErrorMsg('errorMsg fetching Wordle result.');
                setDetailedErrorMsg('Error: ' + error);
            } finally {
                setIsLoading(false);
            }
        };
    }

    const handleWordleReset = () => {
        //restart method replacing entire Wordle component
        onResetWordle();
    }

    const handleWordleInit = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        setDetailedErrorMsg(null);
        setIsFirstLoadFinished(false);
        setIsFailedOnFirstLoad(false);
        setIsGameSuccessful(false);
        setIsGameUnsuccessful(false);
        setActiveGuessIndex(0);
        setGuessItems([{ letter: [], letterResponses: Array(5).fill('absent') }]);

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

            setIsFirstLoadFinished(true);
        } catch (error) {
            setIsFailedOnFirstLoad(true);
            setErrorMsg('Failed to load the first word. Please try again.');
            setDetailedErrorMsg('Error: ' + error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleWordleInitRef = useRef(handleWordleInit);

    useEffect(() => {
        // first load
        handleWordleInitRef.current();
    }, []);

    return (
        <div id="wordle-container">
            {isLoading && (
                <div id="circular-spinner">
                    <CircularProgress />
                </div>
            )}

            {isFirstLoadFinished && !isFailedOnFirstLoad && guessItems.map((guessData, index) => (
                <Guess
                    key={index}
                    guessNumber={index + 1}
                    guessValue={guessData.letter}
                    letterResponses={guessData.letterResponses}
                    onUpdateLetterResponse={(letterIndex, letterResponse) => handleUpdateLetterResponse(index, letterIndex, letterResponse)}
                />
            ))}

            <StatusInfoPane isGameSuccessful={isGameSuccessful} isGameUnsuccessful={isGameUnsuccessful} errorMsg={errorMsg} detailedErrorMsg={detailedErrorMsg} />
          
            {isFirstLoadFinished && !isGameSuccessful && !isGameUnsuccessful && !isFailedOnFirstLoad &&
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

            {(isGameSuccessful || isGameUnsuccessful || isFailedOnFirstLoad) &&
                <div id="reset-button">
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleWordleReset}>
                        {isFailedOnFirstLoad ? 'Try again' : 'Play again'}
                    </Button>
                </div>
            }
        </div>
    );
}

export default Wordle;
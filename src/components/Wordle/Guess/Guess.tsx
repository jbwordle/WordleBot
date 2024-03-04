import { LetterResponse } from '../../../types';
import LetterResponseInput from "../LetterResponse/LetterResponseInput";
import GuessLetterInput from "./GuessLetterInput";

interface GuessProps {
    guessNumber: number;
    guessValue: string[];
    letterResponses: LetterResponse[];
    onUpdateResponse: (letterIndex: number, letterResponse: LetterResponse) => void;
}

const Guess = ({
    guessNumber,
    guessValue,
    letterResponses,
    onUpdateResponse
}: GuessProps) => {
    return (
        <div className="guess-container">
            <div className="guess-header">Guess #{guessNumber}</div>
            <div className="word-to-guess">
                <label>Word to Guess:</label>
                <div className="letter-inputs">
                    {guessValue.map((letter, index) => (
                        <GuessLetterInput
                            key={`guess-${index}`}
                            index={index}
                            value={letter}
                        />
                    ))}
                </div>
            </div>
            <div className="letter-response-inputs">
                <label>What response did you get back?</label>
                <div className="letter-responses">
                    {letterResponses.map((letterResponse, index) => (
                        <LetterResponseInput
                            key={`letterResponse-${index}`}
                            index={index}
                            value={guessValue[index]}
                            letterResponse={letterResponse}
                            onLetterResponseChange={(index, newLetterResponse) => onUpdateResponse(index, newLetterResponse)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Guess;
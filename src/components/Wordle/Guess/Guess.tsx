import { LetterResponse } from '../../../types';
import ResponseLetterInput from "../Response/ResponseLetterInput";
import GuessLetterInput from "./GuessLetterInput";

interface GuessProps {
    guessNumber: number;
    guessValue: string[];
    responses: LetterResponse[];
    onUpdateResponse: (letterIndex: number, response: LetterResponse) => void;
}

const Guess = ({
    guessNumber,
    guessValue,
    responses,
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
            <div className="response-inputs">
                <label>What response did you get back?</label>
                <div className="responses">
                    {responses.map((response, index) => (
                        <ResponseLetterInput
                            key={`response-${index}`}
                            index={index}
                            value={guessValue[index]}
                            response={response}
                            onResponseChange={(index, newResponse) => onUpdateResponse(index, newResponse)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Guess;
import { LetterResponse } from '../../../types';

interface LetterResponseInputProps {
    value: string;
    letterResponse: LetterResponse;
    index: number;
    onLetterResponseChange: (index: number, newLetterResponse: LetterResponse) => void;
}

const LetterResponseInput = ({
    value,
    letterResponse,
    index,
    onLetterResponseChange
}: LetterResponseInputProps) => {
    const handleLetterResponseClick = () => {
        const newLetterResponse: LetterResponse =
        letterResponse === 'correct' ? 'present' :
        letterResponse === 'present' ? 'absent' : 'correct';
        onLetterResponseChange(index, newLetterResponse);
    };

    return (
        <div className="letter-container" onClick={handleLetterResponseClick}>
            <input
                type="text"
                className={`letter-response ${letterResponse}`}
                maxLength={1}
                value={value}
                readOnly
            />
        </div>
    );
};

export default LetterResponseInput;
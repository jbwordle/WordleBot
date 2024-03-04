import { LetterResponse } from '../../../types';

interface LetterInputProps {
    value: string;
    response: LetterResponse;
    index: number;
    onResponseChange: (index: number, newResponse: LetterResponse) => void;
}

const ResponseLetterInput = ({
    value,
    response,
    index,
    onResponseChange
}: LetterInputProps) => {
    const handleResponseClick = () => {
        const nextResponse: LetterResponse =
            response === 'correct' ? 'present' :
                response === 'present' ? 'absent' : 'correct';
        onResponseChange(index, nextResponse);
    };

    return (
        <div className="letter-container" onClick={handleResponseClick}>
            <input
                type="text"
                className={`response ${response}`}
                maxLength={1}
                value={value}
                readOnly
            />
        </div>
    );
};

export default ResponseLetterInput;
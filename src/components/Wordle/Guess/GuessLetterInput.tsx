interface GuessLetterInputProps {
    value: string;
    index: number;
}

const GuessLetterInput = ({
    value,
    index,
}: GuessLetterInputProps) => {
    return (
        <div className="letter-container">
            <input
                type="text"
                key={`guess-${index}`}
                className="guess"
                maxLength={1}
                value={value}
                readOnly={true}
            />
        </div>
    );
};

export default GuessLetterInput;
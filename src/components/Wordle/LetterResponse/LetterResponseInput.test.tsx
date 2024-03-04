import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import LetterResponseInput from './LetterResponseInput';

describe('LetterResponseInput', () => {
    it('changes response from "absent" to "correct" on click and matches index 0', () => {
        const handleLetterResponseChange = jest.fn();
        const { getByRole } = render(
            <LetterResponseInput
                value="A"
                letterResponse="absent"
                index={0}
                onLetterResponseChange={handleLetterResponseChange}
            />
        );

        const letterInput = getByRole('textbox');
        fireEvent.click(letterInput);

        expect(handleLetterResponseChange).toHaveBeenCalledWith(0, 'correct');
    });

    it('changes letter response from "correct" to "present" on click and matches index 1', () => {
        const handleLetterResponseChange = jest.fn();
        const { getByRole } = render(
            <LetterResponseInput
                value="B"
                letterResponse="correct"
                index={1}
                onLetterResponseChange={handleLetterResponseChange}
            />
        );

        const letterInput = getByRole('textbox');
        fireEvent.click(letterInput);

        expect(handleLetterResponseChange).toHaveBeenCalledWith(1, 'present');
    });

    it('changes letter response from "present" to "absent" on click and matches index 2', () => {
        const handleLetterResponseChange = jest.fn();
        const { getByRole } = render(
            <LetterResponseInput
                value="C"
                letterResponse="present"
                index={2}
                onLetterResponseChange={handleLetterResponseChange}
            />
        );

        const letterInput = getByRole('textbox');
        fireEvent.click(letterInput);

        expect(handleLetterResponseChange).toHaveBeenCalledWith(2, 'absent');
    });
});
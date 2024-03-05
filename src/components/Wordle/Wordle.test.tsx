import { act, render, waitFor } from '@testing-library/react';
import Wordle from './Wordle';
import { fetchWordleResult } from '../../api/api';

jest.mock('../../api/api');

describe('Wordle Component', () => {
  test('fetchWordleResult is called on first load', async () => {
    (fetchWordleResult as jest.Mock).mockResolvedValue({
      guess: 'fetch'.split(''),
    });

    await act(async () => {
      render(<Wordle onResetWordle={() => {}} />);
    });

    await waitFor(() => expect(fetchWordleResult).toHaveBeenCalledTimes(1));
  });
});
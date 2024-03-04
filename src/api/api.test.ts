import { fetchWordleResult, WordleRequest, WordleResponse } from './api'
global.fetch = jest.fn();

const API_PATH = "https://interviewing.venteur.co/api/wordle";
const mockedFetch = global.fetch as jest.MockedFunction<typeof fetch>;

beforeEach(() => {
  mockedFetch.mockClear();
});

describe('fetchWordleResult', () => {
  it('call successfully handles an API response', async () => {
    const mockResponse: WordleResponse = { guess: 'fetch' };
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
      status: 200,
    } as Response);

    const request: WordleRequest = [{ word: 'fetch', clue: 'tests' }];
    const result = await fetchWordleResult(request);

    expect(result).toEqual(mockResponse);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith(API_PATH, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  });

  it('should throw an error on a bad API response', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: async () => 'Bad Request',
    } as Response);

    const request: WordleRequest = [{ word: 'fetch', clue: 'tests' }];

    await expect(fetchWordleResult(request)).rejects.toThrow('Bad Request');
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith(API_PATH, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  });
});
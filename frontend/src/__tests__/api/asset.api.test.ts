import { fetchAssets, createAsset, updateAsset, deleteAsset } from '../../api/asset.api';

// Mock fetch globally
global.fetch = jest.fn();

describe('Asset API', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  test('fetchAssets should make GET request to correct endpoint', async () => {
    const mockAssets = [{ id: 1, name: 'Test Asset' }];
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAssets,
    });

    const result = await fetchAssets();
    expect(fetch).toHaveBeenCalledWith('/api/assets');
    expect(result).toEqual(mockAssets);
  });

  test('createAsset should make POST request with correct data', async () => {
    const newAsset = { name: 'New Asset', category: 'Test' };
    const mockResponse = { id: 1, ...newAsset };
    
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await createAsset(newAsset);
    expect(fetch).toHaveBeenCalledWith('/api/assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAsset),
    });
    expect(result).toEqual(mockResponse);
  });
});

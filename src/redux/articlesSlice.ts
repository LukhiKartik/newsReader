import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {checkConnection} from '../utils/offlineStatus';
import {getFromCache, saveToCache} from '../utils/cache';

const API_URL = 'https://newsapi.org/v2/top-headlines';
const API_KEY = '6ce1294014334ff08bbb708c22b1d28f';

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async () => {
    const isConnected = await checkConnection();

    if (isConnected) {
      const response = await axios.get(API_URL, {
        params: {apiKey: API_KEY, country: 'us'},
      });
      const filteredArticles = response.data.articles.filter((article: any) => {
        if (article.urlToImage) {
          return true;
        }

        return false;
      });

      saveToCache(filteredArticles);
      return filteredArticles;
    } else {
      const cachedData = await getFromCache();
      if (cachedData) {
        return cachedData;
      }
      throw new Error('No internet and no cached data available.');
    }
  },
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchArticles.pending, state => {
        state.loading = true;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default articlesSlice.reducer;

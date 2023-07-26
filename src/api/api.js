import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38394341-6bad80d83243545401e924dfe';

export async function getList(searchInput, page) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: searchInput,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: 40,
  });

  const response = await axios.get(`${BASE_URL}?${params}`);
  if (response.data.hits.length === 0) {
    throw new Error(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  return response.data;
}

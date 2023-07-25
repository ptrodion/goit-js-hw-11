import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { searchFormEl, galleryEl } from './refs/refs';
import { getList } from './api/api';
import { markupElements } from './markup/markup';
import { createMarkup, addMarkup } from './helpers/Markup';

searchFormEl.addEventListener('submit', handlerSubmitSearch);

let page = 1;
let searchInput = null;

const lightbox = new SimpleLightbox('.gallery .photo-card a', {
  captionDelay: 250,
});

async function handlerSubmitSearch(e) {
  e.preventDefault();
  searchInput = e.target.elements.searchQuery.value;

  if (!searchInput.trim()) {
    Notiflix.Notify.info('You need to fill in the input');
    return;
  } else {
    try {
      galleryEl.innerHTML = ' ';
      lightbox.refresh();

      const results = await getList(searchInput, page);
      Notiflix.Notify.success(
        `"Hooray! We found ${results.totalHits} images."`
      );
      createMarkup(galleryEl, markupElements(results.hits));
    } catch (error) {
      Notiflix.Notify.failure(error.message);
    }
  }
}

window.scrollBy({
  top: 800,
  behavior: 'smooth',
});

window.addEventListener('scroll', () => {
  const documentReact = document.documentElement.getBoundingClientRect();

  if (documentReact.bottom < document.documentElement.clientHeight + 150) {
    addGallery((page += 2));
  }
});

async function addGallery(page) {
  try {
    const results = await getList(searchInput, page);
    console.log(results.hits);
    addMarkup(galleryEl, markupElements(results.hits));
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

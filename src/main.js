import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { searchFormEl, galleryEl, mask } from './refs/refs';
import { getList } from './api/api';
import { markupElements } from './markup/markup';
import { createMarkup, addMarkup } from './helpers/Markup';

searchFormEl.addEventListener('submit', handlerSubmitSearch);

let searchInput = null;
let page = 1;

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
    mask.classList.remove('hide');
    setTimeout(async () => {
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
      mask.classList.add('hide');
    }, 600);
  }
}

function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;

  if (position >= threshold) {
    addGallery((page += 1));
  }
}

function throttle(callee, timeout) {
  let timer = null;

  return function perform(...args) {
    if (timer) return;

    timer = setTimeout(() => {
      callee(...args);

      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}

window.addEventListener('scroll', throttle(checkPosition, 250));

async function addGallery(page) {
  try {
    const results = await getList(searchInput, page);
    addMarkup(galleryEl, markupElements(results.hits));
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

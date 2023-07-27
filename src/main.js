import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { searchFormEl, galleryEl, mask } from './refs/refs';
import { getList } from './api/api';
import { markupElements } from './markup/markup';
import { createMarkup } from './helpers/helpers';

const lightbox = new SimpleLightbox('.gallery .photo-card a', {
  captionDelay: 250,
});

let searchInput = null;
let page = 1;

searchFormEl.addEventListener('submit', handlerSubmitSearch);

async function handlerSubmitSearch(e) {
  e.preventDefault();
  searchInput = e.target.elements.searchQuery.value;
  if (!searchInput.trim()) {
    Notiflix.Notify.info('You need to fill in the input');

    return;
  } else {
    mask.style.display = 'block';
    setTimeout(async () => {
      try {
        galleryEl.innerHTML = ' ';

        const results = await getList(searchInput, page);

        Notiflix.Notify.success(
          `"Hooray! We found ${results.totalHits} images."`
        );
        createMarkup(galleryEl, markupElements(results.hits));
        lightbox.refresh();
      } catch (error) {
        Notiflix.Notify.failure(error.message);
        e.target.elements.searchQuery.value = '';
      }
      mask.style.display = 'none';
    }, 600);
  }
}

function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 6;
  const position = scrolled + screenHeight;

  if (page >= 13) {
    Notiflix.Notify.failure('You have viewed all photos');
    return;
  }

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
    createMarkup(galleryEl, markupElements(results.hits));
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

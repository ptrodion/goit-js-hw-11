function createMarkup(linkEl, markup) {
  linkEl.innerHTML = markup;
}

function addMarkup(linkEl, markup) {
  linkEl.insertAdjacentHTML('beforeend', markup);
}

export { createMarkup, addMarkup };

function generatePhotoCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
            <a href="${largeImageURL}">
              <img src="${webformatURL}" alt="${tags}" loading="lazy" class="gallery-item"/> 
              <div class="info">
                <div class="info-item-wrapper">
                  <b>Likes</b>
                  <p>${likes}</p>  
                </div>
                <div class="info-item-wrapper">
                  <b>Views</b> 
                  <p>${views}</p> 
                </div>
                <div class="info-item-wrapper">
                  <b>Comments</b>
                  <p> ${comments}</p>     
                </div> 
                <div class="info-item-wrapper">
                  <b>Downloads</b> 
                  <p>${downloads}</p>
                </div>
              </div> 
            </a>
          </div>`;
}

export function markupElements(list) {
  return list.map(generatePhotoCardMarkup).join('');
}

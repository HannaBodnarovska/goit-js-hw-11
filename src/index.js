import Notiflix from 'notiflix';

const apiKey = '39068391-0e28b65d96db8d37b502b2dfc';
const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');

let currentPage = 1;
let currentQuery = '';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  currentQuery = e.target.searchQuery.value.trim();
  currentPage = 1;
  await fetchImages(currentQuery, currentPage);
  loadMoreBtn.style.display = 'block';
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  await fetchImages(currentQuery, currentPage);
});

async function fetchImages(query, page) {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    const data = await response.json();

    if (page === 1) {
      gallery.innerHTML = '';
    }

    if (data.hits.length === 0) {
      loadMoreBtn.style.display = 'none';
      showNotification('Sorry, there are no images matching your search query. Please try again.', false);
      return;
    }

    data.hits.forEach(image => {
      const card = createImageCard(image);
      gallery.appendChild(card);
    });

    if (data.totalHits <= page * 40) {
      loadMoreBtn.style.display = 'none';
      showNotification("We're sorry, but you've reached the end of search results.", false);
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    showNotification('An error occurred while fetching images. Please try again later.', false);
  }
}

function createInfoItem(label, value) {
  const infoItem = document.createElement('p');
  infoItem.className = 'info-item';
  infoItem.innerHTML = `<b>${label}:</b> ${value}`;
  return infoItem;
}

function createImageCard(image) {
  const card = document.createElement('div');
  card.className = 'photo-card';

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';

  const infoDiv = document.createElement('div');
  infoDiv.className = 'info';
  const likes = createInfoItem('Likes', image.likes);
  const views = createInfoItem('Views', image.views);
  const comments = createInfoItem('Comments', image.comments);
  const downloads = createInfoItem('Downloads', image.downloads);

  infoDiv.appendChild(likes);
  infoDiv.appendChild(views);
  infoDiv.appendChild(comments);
  infoDiv.appendChild(downloads);

  card.appendChild(img);
  card.appendChild(infoDiv);

  return card;
}

function showNotification(message, isSuccess) {
  if (isSuccess) {
    Notiflix.Notify.success(message);
  } else {
    Notiflix.Report.failure('Error', message, 'OK');
  }
}

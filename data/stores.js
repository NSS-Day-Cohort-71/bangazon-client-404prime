import { fetchWithResponse, fetchWithoutResponse } from './fetcher'

export function getStores() {
  return fetchWithResponse('stores', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function getStoreById(id) {
  return fetchWithResponse(`stores/${id}`, {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`
    }
  })
}

export function addStore(store) {
  return fetch(`http://localhost:8000/stores`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(store)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    return data;
  })
  .catch(error => {
    console.error('Error in addStore:', error);
    throw error;
  });
}

export function editStore(store) {
  return fetchWithoutResponse(`stores/${store.id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(store)
  })
}

export function favoriteStore(storeId) {
  return fetchWithoutResponse(`profile/favoritesellers`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      store_id: storeId
    })
  })
}

export function unfavoriteStore(favoriteId) {
  return fetchWithoutResponse(`profile/favoritesellers`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ favorite_id: favoriteId })
  })
}

export const getFavoriteStores = async () => {
  return await fetchWithResponse('profile/favoritesellers', {
    headers: {
      Authorization: `Token ${localStorage.getItem('token')}`,
    }
  })
}
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getProducts } from '../../data/products';
import Filter from '../filter';
import { ProductCard } from '../product/card';

export function StoreCard({ store, width = 'is-half' }) {
  // Determine which data structure we're dealing with
  const storeData =
    store.seller && store.seller.store ? store.seller.store : store;
  const ownerData =
    store.seller && store.seller.user ? store.seller.user : store.seller;
  const [storeItems, setStoreItems] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState('Loading products...');
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    getProducts().then((data) => {
      if (data) {
        const locationData = [
          ...new Set(data.map((product) => product.location)),
        ];
        const locationObjects = locationData.map((location) => ({
          id: location,
          name: location,
        }));

        setStoreItems(data.filter((p) => p.store.id === store.id));
        setLocations(locationObjects);
      }
    });
  }, []);

  return (
    <div className={`column ${width}`}>
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            {storeData.name || 'Unnamed Store'}
          </p>
        </header>
        <div className="card-content">
          <p className="content">
            Owner: {ownerData.first_name || ''} {ownerData.last_name || ''}
          </p>
          <div className="content">
            {storeData.description || 'No description available'}
          </div>
          <div className="content">
            Items for sale: {storeData.items_for_sale}
          </div>
        </div>

        <footer className="card-footer">
          <Link
            href={`stores/${storeData.id || ''}`}
            className="card-footer-item"
          >
            View Store
          </Link>
          <div className="columns is-multiline">
            {storeItems.map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

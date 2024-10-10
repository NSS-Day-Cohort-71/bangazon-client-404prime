import { useEffect, useState } from 'react';
import CardLayout from '../components/card-layout';
import Layout from '../components/layout';
import Navbar from '../components/navbar';
import { ProductCard } from '../components/product/card';
import { StoreCard } from '../components/store/card';
import { useAppContext } from '../context/state';
import { getUserProfile } from '../data/auth';
import { getFavoriteStores } from '../data/stores';

export default function Profile() {
  const { profile, setProfile, token } = useAppContext();
  const [favorites, SetFavorites] = useState([]);
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    fetchProfile();
    getLikedProducts();
  }, []);

  const getLikedProducts = async () => {
    const res = await fetch('http://localhost:8000/products/liked', {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const data = await res.json();
    setLikedProducts(data);
  };

  useEffect(() => {
    getFavoriteStores()
      .then((data) => {
        SetFavorites(data);
      })
      .catch((error) => {
        console.error('Error fetching favorite stores:', error);
      });
  }, []);

  const fetchProfile = () => {
    getUserProfile()
      .then((profileData) => {
        if (profileData) {
          setProfile(profileData);
        }
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  };

  return (
    <>
      <CardLayout title="Favorite Stores" width="is-full">
        <div className="columns is-multiline">
          {favorites?.map((favorite) => (
            <StoreCard
              store={favorite}
              key={favorite.id}
              width="is-one-third"
            />
          ))}
        </div>
        <></>
      </CardLayout>
      <CardLayout title="Products you've recommended" width="is-full">
        <div className="columns is-multiline">
          {profile?.recommends?.map((recommendation) => (
            <ProductCard
              product={recommendation.product}
              key={recommendation.product.id}
              width="is-one-third"
            />
          ))}
        </div>
        <></>
      </CardLayout>
      <CardLayout title="Products recommended to you" width="is-full">
        <div className="columns is-multiline">
          {profile?.recommendations_received?.map((recommendation) => (
            <ProductCard
              product={recommendation.product}
              key={recommendation.product.id}
              width="is-one-third"
            />
          ))}
        </div>
        <></>
      </CardLayout>

      <CardLayout title="Products you've liked" width="is-full">
        <div className="columns is-multiline">
          {likedProducts?.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              width="is-one-third"
            />
          ))}
        </div>
        <></>
      </CardLayout>
    </>
  );
}

Profile.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      <section className="container">{page}</section>
    </Layout>
  );
};

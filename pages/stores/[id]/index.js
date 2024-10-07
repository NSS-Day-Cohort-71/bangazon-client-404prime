import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../../../components/layout'
import Navbar from '../../../components/navbar'
import { ProductCard } from '../../../components/product/card'
import Detail from '../../../components/store/detail'
import { useAppContext } from '../../../context/state'
import { deleteProduct } from '../../../data/products'
import { favoriteStore, getFavoriteStores, getStoreById, unfavoriteStore } from '../../../data/stores'

export default function StoreDetail() {
  const { profile } = useAppContext()
  const router = useRouter()
  const { id } = router.query
  const [store, setStore] = useState({})
  const [isOwner, setIsOwner] = useState(false)
  const [favorites, setFavorites] = useState([])

  useEffect(() => {

    if (id) {
      refresh()
    }

    if (profile && profile.stores && profile.stores.length > 0) {
      const userStore = profile.stores[0]
      if (parseInt(id) === userStore.id) {
        setIsOwner(true)
      }
    }
  
    const fetchFavorites = async () => {
      try {
        const data = await getFavoriteStores()
        setFavorites(data)
      } catch (error) {
      }
    }
  
    fetchFavorites()
  }, [id, profile])

  const refresh = () => getStoreById(id).then(storeData => {
    if (storeData) {
      setStore(storeData)
    }
  })

  const removeProduct = (productId) => {
    deleteProduct(productId).then(refresh)
  }

  const favorite = () => {
    favoriteStore(id)
      .then(() => getFavoriteStores())
      .then(data => {
        setFavorites(data)
      })
      .catch(error => console.error("Error favoriting store:", error))
  }

  const unfavorite = () => {
    const favoriteId = favorites.find(fav => fav.seller.store.id === parseInt(id))?.id
    if (favoriteId) {
      unfavoriteStore(favoriteId)
        .then(() => getFavoriteStores())
        .then(data => {
          setFavorites(data)
        })
        .catch(error => console.error("Error unfavoriting store:", error))
    }
  }

  return (
    <div className="container">
    <Detail store={store} isOwner={isOwner} favorite={favorite} unfavorite={unfavorite} favorites={favorites} />
    
    <section className="section">
      <h2 className="title is-3 has-text-primary">Selling</h2>
      <div className="columns is-multiline">
        {
          store.products?.filter(product => !product.sold).map(product => (
            <ProductCard
              product={product}
              key={product.id}
              isOwner={isOwner}
              removeProduct={removeProduct}
            />
          ))
        }
        {
          store.products?.filter(product => !product.sold).length === 0 &&
            <p className="column is-full has-text-centered">There are no products currently for sale.</p>
        }
      </div>
    </section>

    <section className="section">
      <h2 className="title is-3 has-text-success">Sold</h2>
      <div className="columns is-multiline">
        {
          store.products?.filter(product => product.sold).map(product => (
            <ProductCard
              product={product}
              key={product.id}
              isOwner={isOwner}
              removeProduct={removeProduct}
            />
          ))
        }
        {
          store.products?.filter(product => product.sold).length === 0 &&
            <p className="column is-full has-text-centered">No products have been sold yet.</p>
        }
      </div>
    </section>
  </div>
  )
}

StoreDetail.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      {page}
    </Layout>
  )
}

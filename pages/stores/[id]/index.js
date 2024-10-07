import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Layout from '../../../components/layout'
import Navbar from '../../../components/navbar'
import { ProductCard } from '../../../components/product/card'
import Detail from '../../../components/store/detail'
import { useAppContext } from '../../../context/state'
import { deleteProduct, fetchSoldProductsByStore, getProducts } from '../../../data/products'
import { favoriteStore, getFavoriteStores, getStoreById, unfavoriteStore } from '../../../data/stores'

export default function StoreDetail() {
  const { profile } = useAppContext()
  const router = useRouter()
  const { id } = router.query
  const [store, setStore] = useState({})
  const [isOwner, setIsOwner] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [products, setProducts] = useState([])
  const [soldProducts, setSoldProducts] = useState([])

  useEffect(() => {

    if (id) {
      refresh()
    }

    // Check if this is the owner's store
    if (profile && profile.stores && profile.stores.length > 0) {
      const userStore = profile.stores[0]
      if (parseInt(id) === userStore.id) {
        setIsOwner(true)
      }
    }

    // fetch all products by store Id
    const fetchProducts = async () => {
      try {
        const query = `store_id=${id}`
        const productsData = await getProducts(query)
        setProducts(productsData)
      } catch (error) {
        console.error("Error fetching products:", error)
      }
    }

      //FIXME: fix this fetch
    const fetchSoldProducts = async () => {
      const soldData = await fetchSoldProductsByStore({id})
    }
    
    // fetch to see if this is a favorited store
    const fetchFavorites = async () => {
      try {
        const data = await getFavoriteStores()
        setFavorites(data)
      } catch (error) {
      }
    }
  
    fetchProducts()
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
    <>
      <Detail store={store} isOwner={isOwner} favorite={favorite} unfavorite={unfavorite} favorites={favorites} />
      {isOwner && (
        <div className="section">
          <div className="columns">
            <div className="column">
              <h2 className="title is-4 has-text-primary">Selling</h2>
              {
          products?.map(product => (
            <ProductCard
              product={product}
              key={product.id}
              isOwner={isOwner}
              removeProduct={removeProduct}
            />
          ))
        }
        {
          products?.length === 0 ?
            <p>There's no products yet</p>
            :
            <></>
        }
            </div>
            <div className="column">
              <h2 className="title is-4 has-text-success">Sold</h2>
              {
          products?.sold?.map(product => (
            <ProductCard
              product={product}
              key={product.id}
              isOwner={isOwner}
              removeProduct={removeProduct}
            />
          ))
        }
        {
          products?.sold?.length === 0 ?
            <p>There's no products yet</p>
            :
            <></>
        }
            </div>
          </div>
        </div>
      )}
      <div className="columns is-multiline">
        {
          store.products?.map(product => (
            <ProductCard
              product={product}
              key={product.id}
              isOwner={isOwner}
              removeProduct={removeProduct}
            />
          ))
        }
        {
          store.products?.length === 0 ?
            <p>There's no products yet</p>
            :
            <></>
        }
      </div>
    </>
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

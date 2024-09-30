import Link from 'next/link'

export function StoreCard({ store, width = "is-half" }) {

  // Determine which data structure we're dealing with
  const storeData = store.seller && store.seller.store ? store.seller.store : store;
  const ownerData = store.seller && store.seller.user ? store.seller.user : store.seller;

  return (
    <div className={`column ${width}`}>
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            {storeData.name || "Unnamed Store"}
          </p>
        </header>
        <div className="card-content">
          <p className="content">
            Owner: {ownerData.first_name || ""} {ownerData.last_name || ""}
          </p>
          <div className="content">
            {storeData.description || "No description available"}
          </div>
        </div>
        <footer className="card-footer">
          <Link href={`stores/${storeData.id || ""}`} className="card-footer-item">View Store</Link>
        </footer>
      </div>
    </div>
  )
}

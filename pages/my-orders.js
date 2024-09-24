import { useEffect, useState } from 'react'
import CardLayout from '../components/card-layout'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import Table from '../components/table'
import { getOrders } from '../data/orders'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const headers = ['Order Date', 'Total', 'Payment Method']

  useEffect(() => {
    getOrders().then(ordersData => {
      if (ordersData) {
        setOrders(ordersData)
      }
    })
  }, [])

  return (
    <>
      <CardLayout title="Your Orders">
        <Table headers={headers}>
          {
            orders.map((order) => (
              <tr key={order.id}>
                <td>{new Date(order.completed_date).toLocaleDateString()}</td>
                <td>${order.lineitems.reduce((total, lineitem) => {
                  return total + (lineitem.product.price)
                }, 0).toFixed(2)}</td>
                <td>{order.payment_type?.merchant_name}</td>
              </tr>
            ))
          }
        </Table>
        <></>
      </CardLayout>
    </>
  )
}

Orders.getLayout = function getLayout(page) {
  return (
    <Layout>
      <Navbar />
      <section className="container">{page}</section>
    </Layout>
  )
}

// list all saved changes that I made in this module in comments below, so I can list in a PR:
// Displayed `completed_date` in the table
// Calculated the total price of the order by summing the price of each product in the order
// Displayed the merchant name of the payment type in the table


// API
// Added a PaymentSerializer to order.py
// Updated the OrderSerializer to include the embedded payment_type field

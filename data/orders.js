import { fetchWithoutResponse, fetchWithResponse } from "./fetcher";

export function getCart() {
  return fetchWithResponse("cart", {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
}

export function getOrders() {
  return fetchWithResponse("orders", {
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
    },
  });
}

export function completeCurrentOrder(orderId, paymentTypeId) {
  return fetchWithResponse(`orders/${orderId}/complete`, {
    method: "PUT",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payment_type: paymentTypeId }),
  });
}


export function clearCart(orderId) {
  return fetchWithoutResponse(`orders/${orderId}/clear_cart`, {
    method: "DELETE",
    headers: {
      Authorization: `Token ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
}

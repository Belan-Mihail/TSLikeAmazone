import { useMutation, useQuery } from "@tanstack/react-query";
import apiClient from "../apiClient";
import { CartItem, ShippingAddress } from "../types/Cart";
import { Order } from "../types/Order";

export const useGetOrderDetailsQuery = (id: string) =>
  useQuery({
    queryKey: ["orders", id],
    //   return data from backend by id
    queryFn: async () => (await apiClient.get<Order>(`api/orders/${id}`)).data,
  });

  // get paypal order id
export const useGetPaypalClientIdQuery = () =>
  useQuery({
    queryKey: ["paypal-clientId"],
    queryFn: async () =>
      (await apiClient.get<{ clientId: string }>(`/api/keys/paypal`)).data,
  });


  // we use mutation because we will change data in backend
  export const usePayOrderMutation = () =>
    useMutation({
      mutationFn: async (details: { orderId: string }) =>
        (
          await apiClient.put<{ message: string; order: Order }>(
            `api/orders/${details.orderId}/pay`,
            details
          )
        ).data,
    })
  

export const useCreateOrderMutation = () =>
  useMutation({
    mutationFn: async (order: {
      orderItems: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: string;
      itemsPrice: number;
      shippingPrice: number;
      taxPrice: number;
      totalPrice: number;
    }) =>
      // returned data from backend
      (
        await apiClient.post<{ message: string; order: Order }>(
          `api/orders`,
          order
        )
      ).data,
  });

export const useGetOrderHistoryQuery = () =>
  useQuery({
    queryKey: ["order-history"],
    queryFn: async () =>
      (await apiClient.get<Order[]>(`/api/orders/mine`)).data,
  });

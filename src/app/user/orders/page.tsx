"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/supabase";

interface Customer {
  name: string;
  id: number;
}

interface Order {
  customer_id: Customer["id"];
  id: number;
}

interface Product {
  title: string;
  price: number;
  stock: number;
  id: number;
}

interface Order_Product {
  product_id: Product["id"];
  order_id: Order["id"];
  quantity: number;
  id: number;
}

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer["id"] | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [shoppingCart, setShoppingCart] = useState<
    { product_id: number; quantity: number }[]
  >([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orders_products, setOrders_Products] = useState<Order_Product[]>([]);
  const [stocks, setStocks] = useState<Product["stock"]>();

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from("customers").select("*");
    if (error) {
      console.log(error);
    }
    if (data) {
      setCustomers(data);
    }
  };

  const fetchProducts = useCallback(async () => {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      console.log(error);
    }
    if (data) {
      setProducts(data);
    }
  }, []);

  const addShoppingCart = (productId: Product["id"], index: number) => {
    // const { error } = await supabase.from("products").insert({
    //     title: product.title,
    //     price: product.price,
    //     stock: productStock
    //   });
    const copy = [...shoppingCart];
    // if there's currently no same product id in cart, push new product with quantity of 1
    // if there's currently product of same id, increment the quantity of that product by 1
    const productFound = copy.find((v) => v.product_id === productId);

    const originalProduct = products.find((v) => v.id === productId);

    if (!originalProduct) return;

    if (productFound) {
      if (copy[index].quantity < originalProduct.stock)
        copy[index].quantity += 1;
    } else {
      copy.push({
        product_id: productId,
        quantity: 1,
      });
      console.log("yip yip");
    }
    setShoppingCart(copy);

    //   if (error) {
    //     console.log(error);
    //   } else {
    //     await fetchProducts()
    //     const newItem = { title: productTitle, price: productPrice, stock: productStock };
  };

  const removeItem = (productId: number, index: number) => {
    const copy = [...shoppingCart];
    const productFound = copy.find((v) => v.product_id === productId);
    console.log(productId);
    if (productFound) {
      console.log(copy[index]);
      if (productFound.quantity > 1) {
        copy[index].quantity = copy[index].quantity - 1;
      } else {
        copy.splice(index, 1);
      }
    }

    setShoppingCart(copy);
  };

  const createOrder = async () => {
    if (!customer) {
      throw "There's no customer to start the order"
    } try {
      const { error, data } = await supabase
        .from("orders")
        .insert({customer_id: customer,})
      
      if (!data || error) {
        throw "Something went wrong while creating the order"
      }

      const orderProductsToInsert: Omit<Order_Product, "id">[] = 
        shoppingCart.map((cartItem) => {
          return {
            order_id: data.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity
          };
        });
        
      const { error: orderProductError } = await supabase
        .from("order_products")
        .insert(orderProductsToInsert)

      if (orderProductError)
        throw "There's something wrong"

      for (let i = 0; i < orderProductsToInsert.length; i++) {
        
      }
    } catch (error) {
      console.log(error)
    }
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from("orders").select(`
      *,
      order_products (
        *,
        products (
          *
        )
      ),
      customers (
        *
      )
    `);

    console.log(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>This is the order page</h1>
      <p>Make your order</p>
      <br></br>
      <div className="flex">
        <div>
          <select
            onChange={(e) => setCustomer(+e.target.value)}
            value={customer || ""}
          >
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="border-2 border-solid border-black px-2 py-2">
          <p>Shopping Cart:</p>
          {shoppingCart.map((item, index) => {
            const product = products.find((v) => v.id === item.product_id);
            if (!product) return null;
            return (
              <div key={item.product_id}>
                <div className="flex py-1">
                  <p>
                    {product.title} - ${product.price} ({product.stock} in
                    stock)
                  </p>
                  <input type="text" value={item.quantity} />
                  <button
                    className="mx-2 border-2 border-solid border-black rounded"
                    onClick={() => removeItem(item.product_id, index)}
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <button onClick={() => createOrder()}>Create Order</button>
        </div>
      </div>
      <br></br>
      <div className="flex">
        <div className="border-2 border-solid border-black mr-6 px-2 py-2 ml-6">
          <h1 className="font-medium underline decoration-1">
            Product Display
          </h1>
          {products.map((p, index) => (
            <div key={p.id} className="flex mb-1">
              <p className="">{p.title}</p>
              <button
                className="border-2 border-solid border-black rounded-md bg-white mx-2 "
                onClick={() => addShoppingCart(p.id, index)}
              >
                Add
              </button>
            </div>
          ))}
        </div>
        <div className="border-2 border-solid border-black px-2 py-2">
          <h1 className="font-medium underline decoration-1">Order</h1>
          <div>
            {/* {orders_products.map((order) => {
              const ordered = orders.find((v) => v.id === order.order_id)
              const itemsOrdered = orders.find((v) => v.id === order.product_id)
              return (
                <div key={order.order_id}>
                  <div>
                    {itemsOrdered.customer_id}
                  </div>
                </div>
              )
            })} */}
          </div>
        </div>
      </div>
      <br></br>
      <Link href="/user">Go back to user</Link>
    </div>
  );
}

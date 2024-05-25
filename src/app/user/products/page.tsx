'use client';

import Link from "next/link"
import { useState, useEffect } from 'react'
import { supabase } from "@/supabase"

// interface Customer {
//     name: string,
//     id: number;
// }

// interface Order {
//     customer_id: number,
//     id: number;
// }

interface Products {
    title: string,
    price: number,
    stock: number,
    id: number
}

export default function Home1() {
    // const [customerInput, setCustomerInput] = useState('');
    // const [customers, setCustomers] = useState<Customer[]>([])
    const [products, setProducts] = useState<Products[]>([])
    const [productTitle, setProductTitle] = useState<Products['title']>('')
    // const [productPrice, setProductPrice] = useState<Products['price']>()
    // const [productStock, setProductStock] = useState<Products['stock']>()
    // const [productId, setProductId] = useState<Products['id']>()


    // const handleCustomerKeydown = async (e: React.KeyboardEvent<HTMLInputElement>, ) => {
    //     if (e.key === 'Enter') {
    //         if (customers.find((c) => c.name === customerInput)) {
    //             return alert('Cannot create duplicate customer')
    //         }
    //         const response = await supabase.from('customers').insert({
    //             name: customerInput
    //         })

    //         if (response.error) {
    //             console.log(response.error);
    //         }

    //         await fetchCustomers();

    //         setCustomerInput('');
            
    //     }
    // }

    const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
            console.log(error);
        }
        if (data) {
            setProducts(data);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <div>
                <h1>This is the product page</h1>
                {/* <input type='text' value={customerInput}
                onChange={(e) => setCustomerInput(e.target.value)}
                onKeyDown={handleCustomerKeydown} /> */}
                <select onChange={e => setProductTitle(e.target.value)}>
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>
                            <p>{p.title} (in stock - {p.stock}) (${p.price}) </p>
                        </option>
                    ))}
                </select>
                <br></br>
                {/* <select></select>
                <select></select> */}
                {/* <button type="button">Make Order</button> */}
                <Link href="/user">Go back to user</Link>
            </div>
        </>
    )
}
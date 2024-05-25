'use client';

import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/supabase";

interface Customer {
    name: string,
    id: number;
}

interface Order {
    customer_id: number;
    id: number
}

export default function Home() {
    const [customerInput, setCustomerInput] = useState('');
    const [customers, setCustomers] = useState<Customer[]>([])

    const handleCustomerKeydown = async (e: React.KeyboardEvent<HTMLInputElement>, ) => {
        if (e.key === 'Enter') {
            if (customers.find((c) => c.name === customerInput)) {
                return alert('Cannot create duplicate customer')
            }
            const response = await supabase.from('customers').insert({
                name: customerInput
            })

            if (response.error) {
                console.log(response.error);
            }

            await fetchCustomers();

            setCustomerInput('');
            
        }
    }

    const fetchCustomers = async () => {
        const { data, error } = await supabase.from('customers').select('*');
        if (error) {
            console.log(error);
        }
        if (data) {
            setCustomers(data);
        }
    };
    

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <>
            <div>
                <h1>This is the customer page</h1>
                <input placeholder='Add customer' type='text' value={customerInput} 
                onChange={(e) => setCustomerInput(e.target.value)}
                onKeyDown={handleCustomerKeydown} />
                <p>Customers:</p>
                {customers.map((c) => (
                    <div key={c.id} className="flex">
                        <p>{c.name}</p>
                    </div>
                ))}
                <br></br>
                <Link href="/user">Go back to user</Link>
            </div>
        </>
    )
}
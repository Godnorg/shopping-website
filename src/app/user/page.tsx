import Link from "next/link"
import React from "react"
import { useState, useEffect } from "react"

export default function Home () {
    return (
        <div>
            <h1>This is the user page</h1>
            <Link href="/user/customers">customers</Link>
            <br></br>
            <Link href="/user/orders">orders</Link>
            <br></br>
            <Link href="/user/products">products</Link>
            <br></br>
            <Link href="/">Home</Link>
        </div>
    )
} 
'use client';

import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/supabase";


export default function Home() {
  return (
    <div>
      <h1>This is the home page</h1>
      <Link href="/user">User page</Link>
    </div>
  );
}

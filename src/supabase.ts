import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
    "https://mrhbpbycmozvbtzcxmhf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yaGJwYnljbW96dmJ0emN4bWhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEyMjc3NDYsImV4cCI6MjAyNjgwMzc0Nn0.Ut57zvjvvAGFEhhIUjVXqASydD-tCulWpq_lmeH71dw"
)
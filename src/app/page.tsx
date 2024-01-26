"use client"

import { useStorage } from "@/hooks/use-storage"
import AddCake from "@/components/cakes/add-cake"
import Cakes from "@/components/cakes/cakes"
import { columns, Product } from "@/components/products/columns"
import { ProductTable } from "@/components/products/product-table"

export default function Home() {
  const [data] = useStorage<Product[]>("localStorage", "products", [])

  return (
    <main className="max-w-[1080px] mx-auto grid gap-4 py-4">
      <section className="grid gap-3">
        <h1 className="text-4xl font-bold text-center">Productos</h1>
        {data ? <ProductTable columns={columns} data={data} /> : <span>Loading...</span>}
      </section>
      <section className="grid gap-3">
        <AddCake />
        <Cakes />
      </section>
    </main>
  )
}

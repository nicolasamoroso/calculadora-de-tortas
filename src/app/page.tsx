"use client"

import { Cake } from "@/types/cake-types"
import { Product } from "@/types/product-type"
import { SpongeCake } from "@/types/sponge-cake-types"
import { useStorage } from "@/hooks/use-storage"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import AddCake from "@/components/cakes/add-cake"
import Cakes from "@/components/cakes/cakes"
import AddProduct from "@/components/products/add-product"
import { columns } from "@/components/products/columns"
import { ProductTable } from "@/components/products/product-table"
import AddSpongeCake from "@/components/sponge-cake/add-sponge-cake"
import SpongeCakes from "@/components/sponge-cake/sponge-cakes"

export default function Home() {
  const [products] = useStorage<Product[]>("localStorage", "products", [])
  const [spongeCakes] = useStorage<SpongeCake[]>("localStorage", "sponge-cakes", [])
  const [cakes] = useStorage<Cake[]>("localStorage", "cakes", [])

  return (
    <main className="max-w-[1080px] mx-auto grid gap-4 py-4">
      <section className="grid gap-3">
        <h1 className="text-4xl font-bold text-center">Materia prima</h1>
        <AddProduct />
        <Popover>
          <PopoverTrigger className="text-blue-600 underline">
            ¿Cómo funciona?
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm text-muted-foreground">
              Se tiene que agregar la materia prima que se va a utilizar.
              <br />
              Solo se necesita ingresar el nombre, unidad de medida y el valor por el cual
              se compró.
              <br />
              Ejemplo: Nombre: Leche, Peso o Volumen: 1000, Unidad: Vacio, Valor: 42
              <br />Y quedaría: Leche 1000 g/ml $42
            </p>
          </PopoverContent>
        </Popover>
        {products && products.length > 0 && (
          <ProductTable columns={columns} data={products} />
        )}
        <hr />
      </section>
      {products && products.length > 0 && (
        <>
          {spongeCakes && (
            <>
              <section className="grid gap-3">
                <h1 className="text-4xl font-bold text-center">Bizcochuelo</h1>
                <AddSpongeCake />
                <SpongeCakes spongeCakes={spongeCakes} />
                <hr />
              </section>
              {spongeCakes.length > 0 && cakes && (
                <section className="grid gap-3">
                  <h1 className="text-4xl font-bold text-center">Tortas</h1>
                  <AddCake />
                  <Cakes cakes={cakes} />
                  <hr />
                </section>
              )}
            </>
          )}
        </>
      )}
      <button
        onClick={() => {
          localStorage.clear()
          location.reload()
        }}
      >
        Borrar LocalStorage
      </button>
    </main>
  )
}

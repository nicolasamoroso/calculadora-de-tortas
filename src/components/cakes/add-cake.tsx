"use client"

import { ChangeEvent, FormEvent, useState } from "react"

import { Cake, CakeProduct } from "@/types/cake-types"
import { SpongeCake } from "@/types/sponge-cake-types"
import { useStorage } from "@/hooks/use-storage"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Alert from "@/components/alert"
import { imageUpload } from "@/components/base64"
import AddProductToCake from "@/components/cakes/add-products"
import { cakeColumns } from "@/components/cakes/table/cake-columns"
import { CakeProductTable } from "@/components/cakes/table/cake-product-table"
import { Select } from "@/components/select"

const AddCake = () => {
  const [open, setOpen] = useState(false)
  const [spongeCake, setSpongeCake] = useState<SpongeCake | null>(null)
  const [openAlert, setOpenAlert] = useState(false)
  const [data, , removeCakeProducts] = useStorage<CakeProduct[]>(
    "localStorage",
    "cake-products",
    []
  )
  const [img, setImg] = useState<string | null>(null)
  const [, setCakes] = useStorage<Cake[]>("localStorage", `cakes`, [])

  const base64 = (e: ChangeEvent<HTMLInputElement>) => {
    imageUpload({ e, setImg })
  }

  const saveCake = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const name = formData.get("name") as string

    if (!name || !data || data.length === 0 || !spongeCake) {
      alert("No hay datos")
      setOpenAlert(true)
      return
    }

    const cake = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      products: data,
      img: img,
      cost: data.reduce((acc, product) => acc + product.cost, 0),
      spongeCake: spongeCake as SpongeCake,
    }

    setCakes((prev) => {
      if (!prev) return [cake]
      return [...prev, cake]
    })

    removeCakeProducts()
    setOpen(false)
    setImg(null)
    setSpongeCake(null)
  }

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (!open) removeCakeProducts()
          return setOpen((prev) => !prev)
        }}
        open={open}
      >
        <DialogTrigger asChild>
          <Button variant="default" className="w-[80px]">
            Crear
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Torta</DialogTitle>
            <DialogDescription className="text-xs">
              Ingrese todos los campos obligatorios (
              <span className="text-red-500">*</span>) y al menos agregue una materia
              prima
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveCake}>
            <div className="grid gap-2 pt-4 pb-8">
              <div>
                <Label htmlFor="img">Imagen</Label>
                <Input
                  id="img"
                  name="img"
                  type="file"
                  className="pt-1.5"
                  onChange={base64}
                />
              </div>
              <div>
                <Label htmlFor="name">
                  Nombre <span className="text-red-600">*</span>
                </Label>
                <Input id="name" name="name" placeholder="Torta de chocolate" required />
              </div>
              <div>
                <Label htmlFor="diameter">
                  Bizcochuelo <span className="text-red-600">*</span>
                </Label>
                <Select
                  setSelect={setSpongeCake}
                  queryKey="sponge-cakes"
                  text="bizcochuelo"
                />
              </div>
              <div className="py-2 flex flex-col gap-3">
                <h4 className="font-semibold leading-none tracking-tight space-y-1.5 text-center sm:text-left">
                  Materias primas
                </h4>
                <AddProductToCake queryKey="cake-products" />
                {data && data.length > 0 ? (
                  <CakeProductTable
                    columns={cakeColumns}
                    data={data}
                    queryKey="cake-products"
                  />
                ) : undefined}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Crear torta</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Alert openAlert={openAlert} setOpenAlert={setOpenAlert} />
    </>
  )
}

export default AddCake

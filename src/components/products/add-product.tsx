"use client"

import { useState } from "react"

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
import { Product } from "./columns"

const AddProduct = () => {
  const [open, setOpen] = useState(false)
  const [, setValue] = useStorage<Product[]>("localStorage", "products", [])

  const saveProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const name = formData.get("name") as string
    const weight = formData.get("weight") as string
    const cost = formData.get("cost") as string

    if (!name || !weight || !cost || !Number(weight) || !Number(cost)) {
      console.log("invalid form")
      return
    }

    const newProduct = {
      id: String(Date.now()),
      name,
      weight: Number(weight),
      cost: Number(cost),
    }

    setValue((prev) => {
      if (!prev) return [newProduct]
      return [...prev, newProduct]
    })

    setOpen(false)
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-[150px]">
          Agregar Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Producto</DialogTitle>
          <DialogDescription>Hace clic en guardar cuando termines.</DialogDescription>
        </DialogHeader>
        <form onSubmit={saveProduct}>
          <div className="grid gap-2 pt-4 pb-8">
            <div>
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input id="name" name="name" placeholder="Dulce de Leche" />
            </div>
            <div>
              <Label htmlFor="weight" className="text-right">
                Peso (g) o Volumen (ml)
              </Label>
              <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
                <Input
                  id="weight"
                  name="weight"
                  placeholder="1000"
                  type="number"
                  className="text-black"
                />
                g/ml
              </span>
            </div>
            <div>
              <Label htmlFor="cost" className="text-right">
                Valor
              </Label>
              <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
                $
                <Input
                  id="cost"
                  name="cost"
                  placeholder="1000"
                  type="number"
                  className="text-black"
                />
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProduct

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
    const unit = formData.get("unit") as string
    const cost = formData.get("cost") as string

    if (
      !name ||
      !cost ||
      (!weight && !unit) ||
      (weight && !Number(weight)) ||
      (unit && !Number(unit)) ||
      !Number(cost)
    ) {
      console.log("invalid form")
      return
    }

    if (weight && unit) {
      alert("No se pueden ingresar ambos campos de peso y unidad")
      return
    }

    const newProduct = {
      id: String(Date.now()),
      name,
      weight: weight ? Number(weight) : null,
      unit: unit ? Number(unit) : null,
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
          <div className="grid gap-3 pt-4 pb-8">
            <div>
              <Label htmlFor="name">
                Nombre <span className="text-red-600">*</span>
              </Label>
              <Input id="name" name="name" placeholder="Dulce de Leche" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Label htmlFor="weight">
                Peso (g) / Volumen (ml) <span className="text-muted-foreground">*</span>
              </Label>
              <Label htmlFor="unit">
                Unidad <span className="text-muted-foreground">*</span>
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
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
              <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
                <Input
                  id="unit"
                  name="unit"
                  placeholder="1"
                  type="number"
                  className="text-black"
                />
                g/ml
              </span>
            </div>
            <div>
              <Label htmlFor="cost">
                Valor <span className="text-red-600">*</span>
              </Label>
              <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
                $
                <Input
                  id="cost"
                  name="cost"
                  placeholder="1000"
                  type="number"
                  className="text-black"
                  required
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

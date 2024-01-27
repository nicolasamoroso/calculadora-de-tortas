"use client"

import { ChangeEvent, useState } from "react"

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
import { inputValidation } from "@/utils/input-validations"
import { Product } from "./columns"

const AddProduct = () => {
  const [open, setOpen] = useState(false)
  const [, setValue] = useStorage<Product[]>("localStorage", "products", [])
  const [isWeight, setIsWeight] = useState(false)
  const [isUnit, setIsUnit] = useState(false)

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
      alert("Formulario invalido")
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

    setIsWeight(false)
    setIsUnit(false)
    setOpen(false)
  }

  const changeWeight = (e: ChangeEvent<HTMLInputElement>) => {
    inputValidation(e)
    if (e.target.value?.length > 0) {
      setIsWeight(true)
      setIsUnit(false)
    } else {
      setIsWeight(false)
      setIsUnit(false)
    }
  }

  const changeUnit = (e: ChangeEvent<HTMLInputElement>) => {
    inputValidation(e)
    if (e.target.value?.length > 0) {
      setIsUnit(true)
      setIsWeight(false)
    } else {
      setIsUnit(false)
      setIsWeight(false)
    }
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-[100px]">
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar materia prima</DialogTitle>
          <DialogDescription className="text-xs">
            Ingrese todos los campos obligatorios (<span className="text-red-500">*</span>
            ) y al menos uno elegible (<span className="text-yellow-500">*</span>)
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={saveProduct}>
          <div className="grid gap-3">
            <div>
              <Label htmlFor="name">
                Nombre <span className="text-red-600">*</span>
              </Label>
              <Input id="name" name="name" placeholder="Dulce de Leche" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Label
                htmlFor="weight"
                className={isUnit ? "text-muted-foreground font-normal" : "text-black"}
              >
                Peso (g) / Volumen (ml) <span className="text-yellow-500">*</span>
              </Label>
              <Label
                htmlFor="unit"
                className={isWeight ? "text-muted-foreground font-normal" : "text-black"}
              >
                Unidad <span className="text-yellow-500">*</span>
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
                <Input
                  id="weight"
                  name="weight"
                  placeholder={!isUnit ? "1000" : undefined}
                  type="number"
                  className="text-black"
                  onChange={changeWeight}
                  disabled={isUnit}
                  min={0}
                />
                g/ml
              </span>
              <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
                <Input
                  id="unit"
                  name="unit"
                  placeholder={!isWeight ? "1" : undefined}
                  type="number"
                  className="text-black"
                  onChange={changeUnit}
                  disabled={isWeight}
                  min={0}
                />
                u
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
                  onChange={(e) => {
                    inputValidation(e)
                  }}
                  min={0}
                />
              </span>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button type="submit">Agregar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProduct

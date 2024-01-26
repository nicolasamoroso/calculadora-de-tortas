"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"

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
import { CakeProduct } from "@/components/cakes/add-cake"
import ProductSelect from "@/components/cakes/product-select"

export const cakeColumns: ColumnDef<CakeProduct>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const name = row.getValue("name") as string

      return name
    },
  },
  {
    accessorKey: "weight",
    header: "Peso o Voluemn",
    cell: ({ row }) => {
      const weight = row.getValue("weight") as string
      if (!weight) return "-"
      return <>{weight} g/ml</>
    },
  },
  {
    accessorKey: "unit",
    header: "Unidad",
    cell: ({ row }) => {
      const unit = row.getValue("unit") as string
      if (!unit) return "-"
      return <>{unit} u</>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      const [name, setName] = useState(product.name)
      const [weight, setWeight] = useState<string>(String(product.weight))
      const [unit, setUnit] = useState<string>(String(product.unit))
      const [open, setOpen] = useState(false)

      const saveProduct = () => {
        if (!name || (!weight && !unit)) {
          alert("Formulario Invalido")
          return
        }

        setName(name)
        setWeight(weight)
        setUnit(unit)
        setOpen(false)
      }

      return (
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-8 h-8 p-0">
              <Pencil className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
              <DialogDescription>
                Hace clic en guardar cuando termines.
                <span className="text-xs">
                  <br />(<span className="text-red-500">*</span>) Obligatorio
                  <br />
                  <span>(*) Obligatorio al menos uno de los dos</span>
                </span>
              </DialogDescription>
            </DialogHeader>
            <form>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="select">
                    Selecciona un producto <span className="text-red-500">*</span>
                  </Label>
                  <ProductSelect setSelect={setName} initialValue={name} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label
                    htmlFor="weight"
                    className={
                      !product?.weight
                        ? "text-muted-foreground font-normal"
                        : "text-black"
                    }
                  >
                    Peso (g) / Volumen (ml)
                    <span className="text-muted-foreground">*</span>
                  </Label>
                  <Label
                    htmlFor="unit"
                    className={
                      !product?.unit ? "text-muted-foreground font-normal" : "text-black"
                    }
                  >
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
                      value={weight}
                      onChange={(ev) => setWeight(ev.target.value)}
                      className="text-black"
                      disabled={!product?.weight}
                    />
                    g/ml
                  </span>
                  <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
                    <Input
                      id="unit"
                      name="unit"
                      placeholder="1"
                      type="number"
                      value={unit}
                      onChange={(ev) => setUnit(ev.target.value)}
                      className="text-black invalid:ring-destructive"
                      disabled={!product?.unit}
                    />
                    u
                  </span>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={saveProduct}>
                  Guardar cambios
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )
    },
  },
]

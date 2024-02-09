"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"

import { CakeProduct } from "@/types/cake-types"
import { SpongeCakeProduct } from "@/types/sponge-cake-types"
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
import { Select } from "@/components/select"

export const cakeColumns: ColumnDef<CakeProduct | SpongeCakeProduct>[] = [
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
    header: "Peso o Volumen",
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
    cell: ({ row, table }) => {
      const product = row.original

      const queryKey = (table.options.meta as any).queryKey

      const [name, setName] = useState(product)
      const [weight, setWeight] = useState<string>(String(product.weight))
      const [unit, setUnit] = useState<string>(String(product.unit))
      const [open, setOpen] = useState(false)
      const [, setValue] = useStorage<CakeProduct[]>("localStorage", queryKey, [])

      const saveProduct = () => {
        if (!name || (!weight && !unit)) {
          alert("Formulario Invalido")
          return
        }

        if (!product) {
          alert("No hay producto")
          return
        }

        const calculateCost = () => {
          if (!product) return 0

          if (product.weight && weight)
            return (Number(weight) * product.cost) / product.weight

          if (product.unit && unit) return (Number(unit) * product.cost) / product.unit

          return 0
        }

        const cost = calculateCost()

        const newProduct: CakeProduct = {
          id: product.id,
          name: name.name,
          weight: weight ? Number(weight) : null,
          unit: unit ? Number(unit) : null,
          cost: cost,
        }

        setValue((prev) => {
          if (!prev) return []
          return prev.map((p) => {
            if (p.id === product.id) {
              return newProduct
            }
            return p
          })
        })

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
              <DialogTitle>Editar materia prima</DialogTitle>
              <DialogDescription className="text-xs">
                Ingrese todos los campos obligatorios (
                <span className="text-red-500">*</span>) vacío.
              </DialogDescription>
            </DialogHeader>
            <form>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="select">
                    Materia prima <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    setSelect={setName}
                    initialValue={name.name}
                    queryKey="products"
                    text="materias prima"
                  />
                </div>
                {product?.weight && (
                  <div className="grid gap-2">
                    <Label htmlFor="weight" className="text-black">
                      Peso (g) / Volumen (ml) <span className="text-red-500">*</span>
                    </Label>
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
                  </div>
                )}
                {product?.unit && (
                  <div className="grid gap-2">
                    <Label htmlFor="unit" className="text-black">
                      Unidad <span className="text-red-500">*</span>
                    </Label>
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
                )}
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

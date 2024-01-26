"use client"

import { FormEvent, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type Product = {
  id: string
  name: string
  weight: number | null
  unit: number | null
  cost: number
}

export const columns: ColumnDef<Product>[] = [
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
      if (weight == null) return "-"
      return <>{weight} g/ml</>
    },
  },
  {
    accessorKey: "unit",
    header: "Unidad",
    cell: ({ row }) => {
      const unit = row.getValue("unit") as string
      if (unit == null) return "-"
      return <>{unit} u</>
    },
  },
  {
    accessorKey: "cost",
    header: "Valor",
    cell: ({ row }) => {
      const cost = row.getValue("cost") as string

      return <>${cost}</>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      const [name, setName] = useState(product.name)
      const [weight, setWeight] = useState<string>(String(product.weight))
      const [unit, setUnit] = useState<string>(String(product.unit))
      const [cost, setCost] = useState<string>(String(product.cost))
      const [open, setOpen] = useState(false)
      const [, setValue] = useStorage<Product[]>("localStorage", "products", [])

      const saveProduct = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const name = formData.get("name") as string
        const weight = formData.get("weight") as string
        const cost = formData.get("cost") as string

        if (!name || !weight || !cost || !Number(weight) || !Number(cost)) {
          alert("Formulario inválido")
          return
        }

        setName(name)
        setWeight(weight)
        setCost(cost)

        setValue((prev) => {
          if (!prev) return []

          return prev.map((product) => {
            if (product.id === row.original.id) {
              return {
                ...product,
                name,
                weight: Number(weight),
                cost: Number(cost),
              }
            }
            return product
          })
        })

        setOpen(false)
      }

      const deleteProduct = () => {
        setValue((prev) => {
          if (!prev) return []

          return prev.filter((product) => product.id !== row.original.id)
        })
      }

      return (
        <Dialog onOpenChange={setOpen} open={open}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-8 h-8 p-0">
                    <Pencil className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar Producto</DialogTitle>
              <DialogDescription>Hace clic en guardar cuando termines.</DialogDescription>
            </DialogHeader>
            <form onSubmit={saveProduct}>
              <div className="grid gap-3 pt-4 pb-8">
                <div>
                  <Label htmlFor="name">
                    Nombre <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Dulce de Leche"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Label htmlFor="weight">
                    Peso (g) / Volumen (ml){" "}
                    <span className="text-muted-foreground">*</span>
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
                      value={weight}
                      onChange={(event) => setWeight(event.target.value)}
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
                      value={unit}
                      onChange={(event) => setUnit(event.target.value)}
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
                      value={cost}
                      onChange={(event) => setCost(event.target.value)}
                    />
                  </span>
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button variant="destructive" onClick={deleteProduct}>
                  Borrar Producto
                </Button>
                <Button type="submit">Guardar cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )
    },
  },
]

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
    header: "Peso",
    cell: ({ row }) => {
      const weight = row.getValue("weight") as string

      return <>{weight} g/ml</>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original

      const [name, setName] = useState(product.name)
      const [weight, setWeight] = useState<string>(String(product.weight))
      const [open, setOpen] = useState(false)
      const [, setValue] = useStorage<CakeProduct[]>("localStorage", `cake-products`, [])

      const saveProduct = () => {
        if (!name || !weight || !Number(weight)) {
          console.log("invalid form")
          return
        }

        if (name === product.name && weight === String(product.weight)) {
          console.log("no changes")
          setOpen(false)
          return
        }

        setName(name)
        setWeight(weight)

        setValue((prev) => {
          if (!prev) return []

          const cost = (Number(weight) * product.cost) / product.weight

          return prev.map((product) => {
            if (product.id === row.original.id) {
              return {
                ...product,
                name,
                weight: Number(weight),
                cost,
              }
            }
            return product
          })
        })

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
              <DialogTitle>Agregar Producto</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="name">Nombre</Label>
                  <ProductSelect setSelect={setName} initialValue={name} />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="weight">Peso (g) o Volumen (ml)</Label>
                  <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
                    <Input
                      id="weight"
                      name="weight"
                      placeholder="1000"
                      value={weight}
                      onChange={(ev) => setWeight(ev.target.value)}
                      type="number"
                      className="text-black invalid:ring-destructive"
                    />
                    g/ml
                  </span>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={() => saveProduct}>
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

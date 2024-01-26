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
  weight: number
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
    header: "Peso",
    cell: ({ row }) => {
      const weight = row.getValue("weight") as string

      return <>{weight} g/ml</>
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
          console.log("invalid form")
          return
        }

        if (
          name === product.name &&
          weight === String(product.weight) &&
          cost === String(product.cost)
        ) {
          console.log("no changes")
          setOpen(false)
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
              <DialogTitle>Agregar Producto</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={saveProduct}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Dulce de Leche"
                    value={name}
                    onChange={(ev) => setName(ev.target.value)}
                  />
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
                      value={weight}
                      onChange={(ev) => setWeight(ev.target.value)}
                      type="number"
                      className="text-black invalid:ring-destructive"
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
                      value={cost}
                      onChange={(ev) => setCost(ev.target.value)}
                      type="number"
                      className="text-black"
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

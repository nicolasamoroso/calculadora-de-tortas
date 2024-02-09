"use client"

import { ChangeEvent, FormEvent, useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Pencil } from "lucide-react"

import { Cake } from "@/types/cake-types"
import { Product } from "@/types/product-type"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InputWithText } from "@/components/input-with-text"
import { inputValidation } from "@/utils/input-validations"

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
      const [, setProducts] = useStorage<Product[]>("localStorage", "products", [])
      const [, setSpongeCakes] = useStorage<SpongeCake[]>(
        "localStorage",
        "sponge-cakes",
        []
      )
      const [, setCakes] = useStorage<Cake[]>("localStorage", "cakes", [])
      const [isWeight, setIsWeight] = useState(product.weight != null)
      const [isUnit, setIsUnit] = useState(product.unit != null)

      const saveProduct = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const name = formData.get("name") as string
        const weight = formData.get("weight") as string
        const cost = formData.get("cost") as string

        if (!name || !cost || (!weight && !unit)) {
          alert("Formulario inválido")
          return
        }

        setName(name)
        setWeight(weight)
        setCost(cost)

        setProducts((prev) => {
          if (!prev) return []

          return prev.map((product) => {
            if (product.id === row.original.id) {
              return {
                ...product,
                name,
                weight: weight ? Number(weight) : null,
                unit: unit ? Number(unit) : null,
                cost: Number(cost),
              }
            }
            return product
          })
        })

        setSpongeCakes((prev) => {
          if (!prev) return []
          return prev.map((spongeCake) => {
            if (spongeCake.products.find((p) => p.id === row.original.id)) {
              const updatedProducts = spongeCake.products.map((p) => {
                if (p.id === row.original.id) {
                  return {
                    ...p,
                    name,
                    weight: weight ? Number(weight) : null,
                    unit: unit ? Number(unit) : null,
                    cost: Number(cost),
                  }
                }
                return p
              })

              const updatedSpongeCake = {
                ...spongeCake,
                products: updatedProducts,
                cost:
                  updatedProducts.reduce((acc, product) => acc + product.cost, 0) *
                  (1 + Number(spongeCake.additionalCost) / 100),
              }

              return updatedSpongeCake
            }
            return spongeCake
          })
        })

        setOpen(false)
      }

      const deleteProduct = () => {
        setProducts((prev) => {
          if (!prev) return []

          return prev.filter((product) => product.id !== row.original.id)
        })
        setOpen(false)
      }

      const changeWeight = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value?.length > 0) {
          setIsWeight(true)
          setIsUnit(false)
        } else {
          setIsWeight(false)
          setIsUnit(false)
        }
      }

      const changeUnit = (e: ChangeEvent<HTMLInputElement>) => {
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
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
              <DialogTitle>Editar materia prima</DialogTitle>
              <DialogDescription className="text-xs">
                Edite y no deje ningun campo obligatorio (
                <span className="text-red-500">*</span>) ni uno elegible (
                <span className="text-yellow-500">*</span>) vacio.
              </DialogDescription>
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
                  <Label
                    htmlFor="weight"
                    className={
                      isUnit ? "text-muted-foreground font-normal" : "text-black"
                    }
                  >
                    Peso (g) / Volumen (ml) <span className="text-yellow-500">*</span>
                  </Label>
                  <Label
                    htmlFor="unit"
                    className={
                      isWeight ? "text-muted-foreground font-normal" : "text-black"
                    }
                  >
                    Unidad <span className="text-yellow-500">*</span>
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <InputWithText textEnd="g/ml" style={{ right: "18px" }}>
                    <Input
                      id="weight"
                      name="weight"
                      placeholder={!isUnit ? "1000" : undefined}
                      type="number"
                      className="text-black pr-[3.5rem]"
                      value={weight}
                      disabled={isUnit}
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) setWeight("0")
                        else setWeight(e.target.value)

                        changeWeight(e)
                      }}
                      min={0}
                    />
                  </InputWithText>
                  <InputWithText textEnd="u" style={{ right: "8px" }}>
                    <Input
                      id="unit"
                      name="unit"
                      placeholder={!isWeight ? "1" : undefined}
                      type="number"
                      className="text-black pr-[2rem]"
                      value={unit}
                      disabled={isWeight}
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) setUnit("0")
                        else setUnit(e.target.value)

                        changeUnit(e)
                      }}
                      min={0}
                    />
                  </InputWithText>
                </div>
                <div>
                  <Label htmlFor="cost">
                    Valor <span className="text-red-600">*</span>
                  </Label>
                  <InputWithText textStart="$" style={{ left: "8px" }}>
                    <Input
                      id="cost"
                      name="cost"
                      placeholder="1000"
                      type="number"
                      className="text-black pl-[2rem]"
                      value={cost}
                      onChange={(event) => {
                        inputValidation(event)
                        setCost(event.target.value)
                      }}
                      min={0}
                    />
                  </InputWithText>
                </div>
              </div>
              <DialogFooter className="flex gap-2">
                <Button variant="destructive" type="button" onClick={deleteProduct}>
                  Borrar materia prima
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

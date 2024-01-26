import { Dispatch, ElementRef, SetStateAction, useRef, useState } from "react"

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
import { Product } from "@/components/products/columns"

const AddProductToCake = ({
  setData,
}: {
  setData: Dispatch<SetStateAction<CakeProduct[]>>
}) => {
  const [select, setSelect] = useState("")
  const [open, setOpen] = useState(false)
  const weightRef = useRef<ElementRef<"input">>(null)
  const unitRef = useRef<ElementRef<"input">>(null)
  const [data] = useStorage<Product[]>("localStorage", "products", [])

  const name = select
  const product = data?.find((product) => product.name === name)

  const AddProduct = () => {
    const weight = weightRef?.current?.value
    const unit = unitRef?.current?.value

    if (!name || (!weight && !unit)) {
      alert("No hay datos")
      return
    }

    if (!product) {
      alert("No hay producto")
      return
    }

    const cost = product.weight
      ? (Number(weight) * product.cost) / product.weight
      : product.unit
        ? (Number(unit) * product.cost) / product.unit
        : 0

    const newProduct: CakeProduct = {
      id: Math.random().toString(36).slice(2, 9),
      name: product.name,
      weight: weight ? Number(weight) : null,
      unit: unit ? Number(unit) : null,
      cost: cost,
    }

    setData((prev) => [...prev, newProduct])
    setSelect("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-[150px]">
          Agregar Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Agregar un producto</DialogTitle>
          <DialogDescription>
            Hace clic en guardar cuando termines.
            <span className="text-xs">
              <br />(<span className="text-red-500">*</span>) Obligatorio
              <br />
              <span>(*) Obligatorio al menos uno de los dos</span>
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="col-span-2 grid gap-1">
          <Label htmlFor="select">
            Selecciona un producto <span className="text-red-500">*</span>
          </Label>
          <ProductSelect setSelect={setSelect} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Label
            htmlFor="weight"
            className={
              !product?.weight ? "text-muted-foreground font-normal" : "text-black"
            }
          >
            Peso (g) / Volumen (ml) <span className="text-muted-foreground">*</span>
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
              placeholder={product?.weight ? "1000" : undefined}
              type="number"
              ref={weightRef}
              className="text-black"
              disabled={!product?.weight}
            />
            g/ml
          </span>
          <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
            <Input
              id="unit"
              name="unit"
              placeholder={product?.unit ? "1" : undefined}
              type="number"
              ref={unitRef}
              className="text-black"
              disabled={!product?.unit}
            />
            u
          </span>
        </div>
        <DialogFooter>
          <Button
            variant="default"
            className="w-full sm:w-[150px]"
            type="button"
            onClick={AddProduct}
          >
            Guardar Producto
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddProductToCake

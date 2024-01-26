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
  const inputRef = useRef<ElementRef<"input">>(null)
  const [data] = useStorage<Product[]>("localStorage", "products", [])

  const AddProduct = () => {
    const name = select
    const weight = inputRef?.current?.value

    if (!name || !weight) {
      console.log("No hay datos")
      return
    }

    const product = data?.find((product) => product.name === name)
    if (!product) {
      console.log("No hay producto")
      return
    }

    const cost = (Number(weight) * product.cost) / product.weight

    const newProduct: CakeProduct = {
      id: Math.random().toString(36).slice(2, 9),
      name: product.name,
      weight: Number(weight),
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
          Agregar Productos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecciona un producto</DialogTitle>
          <DialogDescription>Hace clic en guardar cuando termines.</DialogDescription>
        </DialogHeader>
        <div className="col-span-2 grid gap-1">
          <Label htmlFor="select">Selecciona un producto</Label>
          <ProductSelect setSelect={setSelect} />
        </div>
        <div className="col-span-2">
          <Label htmlFor="weight">Peso (g) o Volumen (ml)</Label>
          <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
            <Input
              id="weight"
              name="weight"
              placeholder="1000"
              ref={inputRef}
              type="number"
              className="text-black"
            />
            g/ml
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

import { ElementRef, useRef, useState } from "react"

import { CakeProduct } from "@/types/cake-types"
import { Product } from "@/types/product-type"
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
import { InputWithText } from "@/components/input-with-text"
import { Select } from "@/components/select"

const AddProductToCake = ({ queryKey }: { queryKey: string }) => {
  const [select, setSelect] = useState<Product | null>(null)
  const [open, setOpen] = useState(false)
  const weightRef = useRef<ElementRef<"input">>(null)
  const unitRef = useRef<ElementRef<"input">>(null)
  const [data] = useStorage<Product[]>("localStorage", "products", [])
  const [, setValue] = useStorage<any[]>("localStorage", queryKey, [])

  const name = select?.name
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
      name: product.name,
      weight: weight ? Number(weight) : null,
      unit: unit ? Number(unit) : null,
      cost: cost,
    }

    setValue((prev) => {
      if (!prev) return []
      return [...prev, newProduct]
    })

    setSelect(null)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-[100px]"
          onClick={() => {
            setSelect(null)
          }}
        >
          Agregar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Agregar una materia prima</DialogTitle>
          <DialogDescription className="text-xs">
            Edite y no deje ningun campo obligatorio (
            <span className="text-red-500">*</span>
            ).
          </DialogDescription>
        </DialogHeader>
        <div className="col-span-2 grid gap-1">
          <Label htmlFor="select">
            Materia prima <span className="text-red-500">*</span>
          </Label>
          <Select setSelect={setSelect} queryKey="products" text="materia prima" />
        </div>
        {product?.weight && (
          <div className="grid gap-2">
            <Label htmlFor="weight" className="text-black">
              Peso (g) / Volumen (ml) <span className="text-red-500">*</span>
            </Label>
            <InputWithText textEnd="g/ml" style={{ right: "18px" }}>
              <Input
                id="weight"
                name="weight"
                placeholder={product?.weight ? "1000" : undefined}
                type="number"
                ref={weightRef}
                className="text-black pr-[3rem]"
                disabled={!product?.weight}
              />
            </InputWithText>
          </div>
        )}
        {product?.unit && (
          <div className="grid gap-2">
            <Label htmlFor="unit" className="text-black">
              Unidad <span className="text-red-500">*</span>
            </Label>
            <InputWithText textEnd="u" style={{ right: "8px" }}>
              <Input
                id="unit"
                name="unit"
                placeholder={product?.unit ? "1" : undefined}
                type="number"
                ref={unitRef}
                className="text-black pr-[2rem]"
                disabled={!product?.unit}
              />
            </InputWithText>
          </div>
        )}
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

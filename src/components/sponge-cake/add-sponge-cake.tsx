import { FormEvent, useState } from "react"

import { SpongeCake, SpongeCakeProduct } from "@/types/sponge-cake-types"
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
import Alert from "@/components/alert"
import AddProductToCake from "@/components/cakes/add-products"
import { cakeColumns } from "@/components/cakes/table/cake-columns"
import { CakeProductTable } from "@/components/cakes/table/cake-product-table"
import { InputWithText } from "@/components/input-with-text"

const AddSpongeCake = () => {
  const [open, setOpen] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [, setSpongeCakes] = useStorage<SpongeCake[]>("localStorage", "sponge-cakes", [])

  const [data, , removeSpongeCakeProducts] = useStorage<SpongeCakeProduct[]>(
    "localStorage",
    "sponge-cake-products",
    []
  )

  const saveSpongeCake = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const name = formData.get("name") as string
    const diameter = formData.get("diameter") as string
    const addition = formData.get("addition") as string
    if (!name || !diameter || !data || data.length === 0) {
      setOpenAlert(true)
      return
    }

    const spongeCake = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      diameter: Number(diameter),
      products: data,
      cost:
        data.reduce((acc, product) => acc + product.cost, 0) *
        (1 + Number(addition) / 100),
      additionalCost: addition ? Number(addition) : 0,
    }

    setSpongeCakes((prev) => {
      if (!prev) return [spongeCake]
      return [...prev, spongeCake]
    })

    removeSpongeCakeProducts()
    setOpen(false)
  }

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (!open) removeSpongeCakeProducts()
          return setOpen((prev) => !prev)
        }}
        open={open}
      >
        <DialogTrigger asChild>
          <Button variant="default" className="w-[80px]">
            Crear
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crear Bizcochuelo</DialogTitle>
            <DialogDescription className="text-xs">
              Ingrese todos los campos obligatorios (
              <span className="text-red-500">*</span>) y al menos agregue una materia
              prima
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveSpongeCake}>
            <div className="grid gap-2 pt-4 pb-8">
              <div>
                <Label htmlFor="name">
                  Nombre <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Bizcochuelo de chocolate"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col justify-between gap-1">
                  <Label htmlFor="diameter">
                    Diametro (cm) <span className="text-red-600">*</span>
                  </Label>
                  <InputWithText textEnd="cm" style={{ right: "18px" }}>
                    <Input
                      id="diameter"
                      name="diameter"
                      placeholder="15"
                      type="number"
                      className="text-black pr-[3rem]"
                      required
                    />
                  </InputWithText>
                </div>
                <div className="flex flex-col justify-between gap-1">
                  <Label htmlFor="addition">
                    Porcentaje extra de ganancia
                    <span className="text-yellow-500"> *</span>
                  </Label>
                  <InputWithText textEnd="%" style={{ right: "8px" }}>
                    <Input
                      id="addition"
                      name="addition"
                      placeholder="20"
                      type="number"
                      className="text-black pr-[2.3rem]"
                    />
                  </InputWithText>
                </div>
              </div>

              <div className="py-2 flex flex-col gap-3">
                <h4 className="font-semibold leading-none tracking-tight space-y-1.5 text-center sm:text-left">
                  Materias primas
                </h4>
                <AddProductToCake queryKey="sponge-cake-products" />
                {data && data.length > 0 ? (
                  <CakeProductTable
                    columns={cakeColumns}
                    data={data}
                    queryKey="sponge-cake-products"
                  />
                ) : undefined}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Crear bizcochuelo</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Alert openAlert={openAlert} setOpenAlert={setOpenAlert} />
    </>
  )
}

export default AddSpongeCake

"use client"

import { ChangeEvent, FormEvent, useState } from "react"

import { useStorage } from "@/hooks/use-storage"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import { imageUpload } from "@/components/base64"
import AddProductToCake from "@/components/cakes/add-product-to-cake"
import { cakeColumns } from "@/components/cakes/table/cake-columns"
import { CakeProductTable } from "@/components/cakes/table/cake-product-table"

export type CakeProduct = {
  id: string
  name: string
  weight: number | null
  unit: number | null
  cost: number
}

export type Cake = {
  id: string
  name: string
  radio: number
  products: CakeProduct[]
  img: string | null
  cost: number
}

const AddCake = () => {
  const cakeId = Math.random().toString(36).slice(2, 9)
  const [open, setOpen] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [data, setData] = useState<CakeProduct[]>([])
  const [img, setImg] = useState<string | null>(null)
  const [, setCakes] = useStorage<Cake[]>("localStorage", `cakes`, [])

  const initialCake: Cake = {
    id: cakeId,
    name: "Default Cake",
    radio: 0,
    products: [],
    img: img,
    cost: 0,
  }

  const [, setValue] = useStorage<Cake>(
    "localStorage",
    `cake-${cakeId}-products`,
    initialCake
  )

  const base64 = (e: ChangeEvent<HTMLInputElement>) => {
    imageUpload({ e, setImg })
  }

  const saveCake = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const name = formData.get("name") as string
    const radio = formData.get("radio") as string

    if (!name || !radio || !data || data.length === 0) {
      console.log("No hay datos")
      setOpenAlert(true)
      return
    }

    const cake = {
      id: Math.random().toString(36).slice(2, 9),
      name,
      radio: Number(radio),
      products: data,
      img: img,
      cost: data.reduce((acc, product) => acc + product.cost, 0),
    }

    setValue(cake)
    setCakes((prev) => {
      if (!prev) return [cake]
      return [...prev, cake]
    })
    setData([])
    setOpen(false)
    setImg(null)
  }

  return (
    <>
      <Dialog
        onOpenChange={(open) => {
          if (!open) setData([])
          return setOpen((prev) => !prev)
        }}
        open={open}
      >
        <DialogTrigger asChild>
          <Button variant="default" className="w-[150px]">
            Agregar Torta
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar Torta</DialogTitle>
            <DialogDescription>Hace clic en guardar cuando termines.</DialogDescription>
          </DialogHeader>
          <form onSubmit={saveCake}>
            <div className="grid gap-2 pt-4 pb-8">
              <div>
                <Label htmlFor="img">Imagen</Label>
                <Input
                  id="img"
                  name="img"
                  type="file"
                  className="pt-1.5"
                  onChange={base64}
                />
              </div>
              <div>
                <Label htmlFor="name">
                  Nombre <span className="text-red-600">*</span>
                </Label>
                <Input id="name" name="name" placeholder="Torta de chocolate" required />
              </div>
              <div>
                <Label htmlFor="radio">
                  Radio (cm) <span className="text-red-600">*</span>
                </Label>
                <span className="flex items-center gap-x-1 text-sm text-muted-foreground">
                  <Input
                    id="radio"
                    name="radio"
                    placeholder="15"
                    type="number"
                    className="text-black"
                    required
                  />
                  cm
                </span>
              </div>
              <div className="py-2 flex flex-col gap-2">
                <AddProductToCake setData={setData} />
                {data && data.length > 0 ? (
                  <CakeProductTable columns={cakeColumns} data={data} />
                ) : undefined}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Debes ingresar un producto</AlertDialogTitle>
            <AlertDialogDescription>
              Para poder crear una torta debes ingresar al menos un producto en la torta
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Ok</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default AddCake

import { Cake } from "@/types/cake-types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ViewProducts from "@/components/cakes/view-products"
import { InputWithText } from "@/components/input-with-text"

export const Settings = ({ cake }: { cake: Cake }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Ajustes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustes</DialogTitle>
          <DialogDescription>Configura los ajustes de este pastel</DialogDescription>
          <div>
            <h1 className="text-md font-medium">Productos</h1>
            <ViewProducts cake={cake} />

            {/* <div className="flex items-center justify-between">
              <div className="flex items-end gap-2">
                <Label htmlFor="weight" className="text-black">
                  Agregar porcentaje a los productos:{" "}
                </Label>
                <InputWithText textEnd="%" style={{ right: "18px" }}>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    className="text-black pr-[3rem]"
                  />
                </InputWithText>
                <Button variant="outline" className="text-sm">
                  Aplicar
                </Button>
              </div>
            </div> */}
          </div>
        </DialogHeader>
        <div></div>
      </DialogContent>
    </Dialog>
  )
}

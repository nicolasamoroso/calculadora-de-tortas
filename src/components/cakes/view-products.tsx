import { Cake } from "@/types/cake-types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

const ViewProducts = ({ cake }: { cake: Cake }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sm text-blue-600">
          Ver productos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Productos utilizados:</DialogTitle>
        </DialogHeader>
        <div>
          {cake.products.map((product) => (
            <label key={product.id} className="flex flex-col items-start">
              <p>Producto: {product.name}</p>
              <p>
                Peso: {product.weight ? product.weight + " g/ml" : product.unit + " u"}
              </p>
              <p>Costo: ${product.cost}</p>
              <Separator className="mt-2" />
            </label>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ViewProducts

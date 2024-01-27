import { useStorage } from "@/hooks/use-storage"
import { Skeleton } from "@/components/ui/skeleton"
import { Cake } from "@/components/cakes/add-cake"

const Cakes = () => {
  const [data] = useStorage<Cake[]>("localStorage", `cakes`, [])
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {data?.map((cake) => {
        return (
          <div key={cake.id} className="flex flex-col items-center text-center">
            {cake.img ? (
              <img src={cake.img} alt={cake.name} className="w-[100px] h-[100px]" />
            ) : (
              <Skeleton className="w-[100px] h-[100px]" />
            )}
            <h1 className="text-lg font-bold">{cake.name}</h1>
            <p className="text-sm text-muted-foreground">{cake.radio}cm</p>
            <p className="font-semibold">${cake.cost.toFixed(2).replace(".", ",")}</p>
            <a href="" className="text-sm text-blue-600 underline">
              Ver más
            </a>
            {/* {cake.products.map((product) => (
              <div key={product.id}>
                <h4>{product.name}</h4>
                <h5>{product.weight}</h5>
                <h6>{product.cost}</h6>
              </div>
            ))} */}
          </div>
        )
      })}
    </div>
  )
}

export default Cakes

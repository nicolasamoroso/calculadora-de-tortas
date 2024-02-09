import { Cake } from "@/types/cake-types"
import { Skeleton } from "@/components/ui/skeleton"
import { Settings } from "@/components/cakes/settings"

const Cakes = ({ cakes }: { cakes: Cake[] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {cakes?.map((cake) => {
        return (
          <div key={cake.id} className="flex flex-col items-center text-center">
            {cake.img ? (
              <img src={cake.img} alt={cake.name} className="w-[100px] h-[100px]" />
            ) : (
              <Skeleton className="w-[100px] h-[100px]" />
            )}
            <h1 className="text-lg font-bold">{cake.name}</h1>
            <p className="text-sm text-muted-foreground">{cake.spongeCake.diameter}cm</p>
            <p className="font-semibold">${cake.cost.toFixed(2).replace(".", ",")}</p>
            <p>{cake.spongeCake.name}</p>
            <Settings cake={cake} />
          </div>
        )
      })}
    </div>
  )
}

export default Cakes

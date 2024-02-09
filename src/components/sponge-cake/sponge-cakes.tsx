import { SpongeCake } from "@/types/sponge-cake-types"

const SpongeCakes = ({ spongeCakes }: { spongeCakes: SpongeCake[] }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {spongeCakes?.map((spongeCake) => {
        return (
          <div key={spongeCake.id} className="flex flex-col items-center text-center">
            <h1 className="text-lg font-bold">{spongeCake.name}</h1>
            <p className="text-sm text-muted-foreground">{spongeCake.diameter}cm</p>
            <p className="font-semibold">
              ${spongeCake.cost.toFixed(2).replace(".", ",")}
            </p>
            <a href="" className="text-sm text-blue-600 underline">
              Ver más
            </a>
            {/* {spongeCake.products.map((product) => (
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

export default SpongeCakes

import { SpongeCake } from "@/types/sponge-cake-types"

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
  spongeCake: SpongeCake
  products: CakeProduct[]
  img: string | null
  cost: number
}

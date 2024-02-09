export type SpongeCakeProduct = {
  id: string
  name: string
  weight: number | null
  unit: number | null
  cost: number
}

export type SpongeCake = {
  id: string
  name: string
  diameter: number
  products: SpongeCakeProduct[]
  cost: number
  additionalCost: number
}

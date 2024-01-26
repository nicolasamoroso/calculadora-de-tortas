"use client"

import { Dispatch, PropsWithRef, Ref, SetStateAction, useState } from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { useStorage } from "@/hooks/use-storage"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Product } from "@/components/products/columns"

const ProductSelect = ({
  setSelect,
  initialValue,
}: {
  setSelect: Dispatch<SetStateAction<string>>
  initialValue?: string
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(initialValue || "")
  const [data] = useStorage<Product[]>("localStorage", "products", [])
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open}>
          {value
            ? data?.find((product) => product.name.toLowerCase() === value.toLowerCase())
                ?.name
            : "Seleccionar un producto..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar productos..." className="h-9" />
          <CommandEmpty>No se encontró ningún producto</CommandEmpty>
          <CommandGroup>
            {data?.map((product) => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                  setSelect(product.name)
                }}
              >
                {product.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === product.name ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default ProductSelect

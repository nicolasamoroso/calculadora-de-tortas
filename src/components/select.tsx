"use client"

import { useState } from "react"
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

export const Select = ({
  setSelect,
  initialValue,
  queryKey,
  text,
}: {
  setSelect: any
  initialValue?: string
  queryKey: string
  text: string
}) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(initialValue || "")
  const [data] = useStorage<any[]>("localStorage", queryKey, [])
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full">
          {value
            ? data?.find((product) => product.name.toLowerCase() === value.toLowerCase())
                ?.name
            : `Seleccionar ${text}...`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Buscar ${text}...`} className="h-9" />
          <CommandEmpty>No se encontró ninguna {text}</CommandEmpty>
          <CommandGroup>
            {data?.map((product) => (
              <CommandItem
                key={product.id}
                value={product.name}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue)
                  setOpen(false)
                  setSelect(product)
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

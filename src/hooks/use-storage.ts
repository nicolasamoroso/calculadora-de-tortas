"use client"

import * as React from "react"
import { useQuery } from "@tanstack/react-query"

import { useIsHydrated } from "./use-is-hydrated"

export const useStorage = <Schema>(
  type: "localStorage" | "sessionStorage",
  key: string,
  initialValue: Schema,
  options?: { enabled?: boolean }
) => {
  const isHydrated = useIsHydrated()
  const isDisabled = options?.enabled === false || !isHydrated

  const query = useQuery<Schema>({
    queryKey: [key],
    queryFn: () => {
      if (!isHydrated) return initialValue
      const storedValue = window[type].getItem(key)
      return storedValue ? JSON.parse(storedValue) : initialValue
    },
    initialData: initialValue,
    enabled: !isDisabled,
  })

  const setValue = React.useCallback(
    (valueOrUpdater: ValueOrUpdater<Schema>) => {
      if (isDisabled) return
      const nextValue =
        typeof valueOrUpdater === "function"
          ? // @ts-expect-error
            valueOrUpdater(query.data)
          : valueOrUpdater
      window[type].setItem(key, JSON.stringify(nextValue))
      query.refetch()
    },
    [isDisabled, key, query, type]
  )

  return [query.data, setValue, query] as const
}

type ValueOrUpdater<Value> = ((prev: Value | undefined) => Value) | Value

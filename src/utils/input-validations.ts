import { ChangeEvent } from "react"

export const inputValidation = (e: ChangeEvent<HTMLInputElement>) => {
  if (Number(e.target?.value) < 0) {
    e.target.value = "0"
  }
}

import { CSSProperties, ReactNode } from "react"

export const InputWithText = ({
  children,
  textStart,
  textEnd,
  style,
}: {
  children: ReactNode
  textStart?: string
  textEnd?: string
  style?: CSSProperties
}) => {
  return (
    <div className="flex items-center text-muted-foreground relative">
      {textStart && (
        <span className="input-module input-module-left text-sm" style={style}>
          {textStart}
        </span>
      )}
      {children}
      {textEnd && (
        <span className="input-module input-module-right text-sm" style={style}>
          {textEnd}
        </span>
      )}
    </div>
  )
}

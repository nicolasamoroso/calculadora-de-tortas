import { ChangeEvent } from "react"

export const imageUpload = ({
  e,
  setImg,
}: {
  e: ChangeEvent<HTMLInputElement>
  setImg: (img: string) => void
}) => {
  const file = e.target.files ? e.target.files[0] : null
  if (!file) return
  getBase64(file).then((base64) => {
    setImg(base64 as string)
  })
}

const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

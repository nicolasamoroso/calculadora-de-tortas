import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Alert = ({
  openAlert,
  setOpenAlert,
}: {
  openAlert: boolean
  setOpenAlert: (open: boolean) => void
}) => {
  return (
    <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Faltaron datos completar</AlertDialogTitle>
          <AlertDialogDescription>
            Para poder crear una torta debes ingresar al menos una materia prima.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Ok</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default Alert

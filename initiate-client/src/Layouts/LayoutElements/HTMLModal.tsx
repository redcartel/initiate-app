import { Dialog, Modal } from "react-aria-components"
import { ModalOverlay } from "react-aria-components"
import { DialogTrigger } from "react-aria-components"
import { CGButton } from "../../Components/CGButton"

export const HTMLModal = ({htmlLink, children}: {htmlLink?: string, children: React.ReactNode}) => {
    return !htmlLink ? <></> : <DialogTrigger>
        {children}
        <ModalOverlay className={({ isEntering, isExiting }) => `
          fixed inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
          ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''}
          ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''}
        `} shouldCloseOnInteractOutside={_e => true}>
            <Modal className={({ isEntering, isExiting }) => `
            w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle bg-secondary-100 shadow-xl
            ${isEntering ? 'animate-in zoom-in-95 ease-out duration-300' : ''}
            ${isExiting ? 'animate-out zoom-out-95 ease-in duration-200' : ''}
          `}>
            <Dialog className="outline-none relative bg-secondary-100 flex flex-col items-stretch justify-top">
                <iframe src={htmlLink} className="w-full flex-grow h-[66vh]"/>
                <CGButton slot='close' theme="secondary" hue='dark'>Ok</CGButton>
            </Dialog>
            </Modal>
        </ModalOverlay>
    </DialogTrigger>
}
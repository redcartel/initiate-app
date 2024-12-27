import { Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from "react-aria-components"
import InitButton from "../individual-components/InitButton";
import { useAppState } from "../../hooks/useAppState";
import { AppState } from "../../context/AppStateContext";

const ClearTurnButton = ({ className }: { className?: string }) => {
    const { dispatch } = useAppState();

    return (
        <>
            <DialogTrigger>
                <InitButton className={`bg-red-500 ${className}`}>
                    Clear Turn
                </InitButton>
                <ModalOverlay className={({ isEntering, isExiting }) => `
            absolute inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
            ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''}
            ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''}
          `}>
                    <Modal className={({ isEntering, isExiting }) => `
            w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl
            ${isEntering ? 'animate-in zoom-in-95 ease-out duration-300' : ''}
            ${isExiting ? 'animate-out zoom-out-95 ease-in duration-200' : ''}
          `}>
                        <Dialog role="alertdialog" className="relative outline-none">
                            {({ close }) => (
                                <>
                                    <Heading level={3}>
                                        Are you sure you want to clear the turn?
                                    </Heading>
                                    <div className="flex flex-row gap-2 justify-evenly">
                                        <InitButton onPress={() => {
                                            dispatch((state: AppState) => ({
                                                ...state, orders: undefined, page: 0
                                            }));
                                            close();
                                        }} className='text-white bg-red-500'>Clear</InitButton>
                                        <InitButton onPress={close} className='bg-green-200' autoFocus>Cancel</InitButton>
                                    </div>
                                </>
                            )}
                        </Dialog>
                    </Modal>
                </ModalOverlay >
            </DialogTrigger>
        </>
    )
}

export default ClearTurnButton;
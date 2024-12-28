import { ModalOverlay, DialogTrigger, Modal, Dialog, Text, Heading } from "react-aria-components";
import { AdminButton } from "../components/individual-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
import { useId } from "react";
import useRouteIds from "../hooks/useRouteIds";

const InitFooter = () => {
    const navigate = useNavigate();

    const id = useId();

    const handleReset = () => {
        window.localStorage.removeItem('gameId');
        window.localStorage.removeItem('adminId');
        navigate('/');
    }

    const { gameId } = useRouteIds();



    return <footer className='flex flex-col items-center flex-shrink-0 w-screen gap-2 p-4 mx-auto bg-gray-500 text-gray-50 max-w-96'>
        {gameId && <DialogTrigger>
            <AdminButton className='text-white bg-blue-600 rounded-full'>
                Game Info
            </AdminButton>
            <ModalOverlay className={({ isEntering, isExiting }) => `
          fixed inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
          ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''}
          ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''}
        `}>
                <Modal className={({ isEntering, isExiting }) => `
            w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl
            ${isEntering ? 'animate-in zoom-in-95 ease-out duration-300' : ''}
            ${isExiting ? 'animate-out zoom-out-95 ease-in duration-200' : ''}
          `}>
                    <Dialog role="dialog" className="relative outline-none">
                        {({ close }) => {
                            if (document.getElementById(id)) {
                                document.getElementById(id)!.innerHTML = 'game info placeholder';
                            }
                            return (
                                <>
                                    <Heading className='mb-4 text-2xl text-center text-blue-600' level={3}><FontAwesomeIcon icon={faUser} /> Game Info</Heading>
                                    <div id={id} className="flex flex-col gap-2 mb-4" />
                                    <AdminButton onPress={close}>Close</AdminButton>
                                </>
                            )
                        }}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>}

        <DialogTrigger>
            <AdminButton className='text-white bg-red-500 rounded-full border-red-950'>
                Reset Admin & Game
            </AdminButton>
            <ModalOverlay className={({ isEntering, isExiting }) => `
          fixed inset-0 z-10 overflow-y-auto bg-black/25 flex min-h-full items-center justify-center p-4 text-center backdrop-blur
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
                            <div>
                                <Heading className='text-2xl text-center text-red-600' level={3}><FontAwesomeIcon icon={faExclamationTriangle} /> Reset Game & Character</Heading>
                                <Text className=''>Are you sure you want to reset the game and character?</Text>
                                <div className="flex flex-row w-full gap-2 mt-8 justify-evenly">
                                    <AdminButton onPress={() => {
                                        handleReset();
                                        close();
                                    }} className="text-white bg-red-500 border-red-950"><FontAwesomeIcon icon={faTrash} /> Reset</AdminButton>

                                    <AdminButton onPress={close} className="text-white bg-blue-500 border-blue-950">Keep Game & Character</AdminButton>
                                </div>
                            </div>
                        )}
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </DialogTrigger>
    </footer >
}

export default InitFooter;
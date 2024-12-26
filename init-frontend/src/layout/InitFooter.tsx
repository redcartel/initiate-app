import InitButton from "../components/individual-components/InitButton";
import { useGameAndCharacter } from "../hooks/useGameAndCharacter";

const InitFooter = () => {
    const { resetGameAndCharacter } = useGameAndCharacter();

    return <footer className='flex flex-col items-center flex-shrink-0 w-screen gap-2 p-4 bg-gray-500 text-gray-50'>
        <InitButton onPress={resetGameAndCharacter}>
            Reset Game & Character
        </InitButton>
    </footer>
}

export default InitFooter;
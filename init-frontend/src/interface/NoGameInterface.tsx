import InitForm from "../components/individual-components/InitForm";
import { useState } from "react";
import InitInput from "../components/individual-components/InitInput";
import InitButton from "../components/individual-components/InitButton";
import { useGameAndCharacter } from "../hooks/useGameAndCharacter";

const NoGameInterface = () => {
    const [textInput, setTextInput] = useState('');
    const { setGameId } = useGameAndCharacter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('setGameId submit', textInput);
        setGameId(textInput);
        return false;
    }

    return <div className='flex-row items-center justify-center'>
        <InitForm onSubmit={handleSubmit} label='Navigate to game' description='Enter the code to navigate to the game'>
            <InitInput value={textInput} onChange={e => setTextInput(`${e.target.value}`)} className='max-w-lg mx-auto text-2xl font-bold tracking-widest text-center' />
            <InitButton type='submit' className='max-w-md mx-auto text-xl font-bold tracking-wide'>Go to Game</InitButton>
        </InitForm>
    </div>
}

export default NoGameInterface;
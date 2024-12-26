import { useState } from "react";
import InitButton from "../components/individual-components/InitButton";
import InitForm from "../components/individual-components/InitForm";
import InitInput from "../components/individual-components/InitInput";
import { useGameAndCharacter } from "../hooks/useGameAndCharacter";

const NoCharacterInterface = () => {
    const [textInput, setTextInput] = useState('');
    const { setCharacterId } = useGameAndCharacter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCharacterId(textInput);
        return false;
    }

    return <div>
        <InitForm onSubmit={handleSubmit} label='Input Character Id' description='Load a character into the game'>
            <InitInput value={textInput} onChange={e => setTextInput(`${e.target.value}`)} className='max-w-lg mx-auto text-2xl font-bold tracking-widest text-center' />
            <InitButton type='submit' className='max-w-md mx-auto text-xl font-bold tracking-wide'>Go to Game</InitButton>
        </InitForm>
    </div>
}

export default NoCharacterInterface;
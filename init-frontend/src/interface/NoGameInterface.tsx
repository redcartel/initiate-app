import InitForm from "../components/individual-components/InitForm";
import { useState } from "react";
import InitInput from "../components/individual-components/InitInput";
import InitButton from "../components/individual-components/InitButton";
import { useNavigate } from "react-router-dom";
import useConfirmGame from "../hooks/useConfirmGame";

const NoGameInterface = () => {
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState(false);
    const confirmGame = useConfirmGame();
    const navigate = useNavigate();


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        confirmGame(textInput, null).then(result => {
            if (result) {
                navigate(`/${textInput}`);
            }
            else {
                setError(true);
            }
        });
        return false;
    }

    return <div className='flex-row items-center justify-center'>
        <InitForm onSubmit={handleSubmit} label='Navigate to game' description='Enter the code to navigate to the game' className={"flex flex-col items-center justify-center border-none"}>
            {error && <div className='text-lg font-bold text-center text-red-500'>Invalid game code</div>}
            <div className='flex flex-row items-center justify-evenly'>
                <InitInput value={textInput} onChange={e => {
                    setError(false);
                    setTextInput(`${e.target.value}`)
                }} className='max-w-lg mx-auto text-2xl font-bold tracking-widest text-center' />
                <InitButton className='ml-4 text-white bg-red-500 rounded-full' onPress={() => {
                    setError(false);
                    setTextInput('');
                }}>Clear</InitButton>
            </div>
            <InitButton type='submit' className='max-w-md mx-auto text-xl font-bold tracking-wide bg-red'>Go to Character</InitButton>

        </InitForm>
    </div>
}

export default NoGameInterface;
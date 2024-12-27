import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InitButton from "../components/individual-components/InitButton";
import InitForm from "../components/individual-components/InitForm";
import InitInput from "../components/individual-components/InitInput";
import useConfirmGame from "../hooks/useConfirmGame";

const NoCharacterInterface = ({ gameId }: { gameId: string | null }) => {
    const [textInput, setTextInput] = useState('');
    const navigate = useNavigate();
    const confirmGame = useConfirmGame();
    const [error, setError] = useState(false);



    useEffect(() => {
        if (!gameId) {
            navigate('/');
        }
    }, [gameId, navigate]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        confirmGame(gameId!, textInput).then(result => {
            if (result) {
                navigate(`/${gameId}/${textInput}`);
            } else {
                setError(true);
            }
        });
        return false;
    }

    return <div>
        <InitForm onSubmit={handleSubmit} label='Input Character Id' description={`Load a character into the game ${gameId}`}>
            {error && <div className='text-lg font-bold text-center text-red-500'>Invalid character id</div>}
            <div className='flex flex-row items-center justify-evenly'>
                <InitInput value={textInput} onChange={e => setTextInput(`${e.target.value}`)} className='max-w-lg mx-auto text-2xl font-bold tracking-widest text-center' />

                <InitButton onPress={() => {
                    setError(false);
                    setTextInput('');
                }} className='ml-4 text-white bg-red-500 rounded-full'>Clear</InitButton>
            </div>
            <InitButton type='submit' className='max-w-md mx-auto text-xl font-bold tracking-wide'>Go to Game</InitButton>
        </InitForm>
    </div>
}

export default NoCharacterInterface;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InitButton from "../components/individual-components/InitButton";
import InitForm from "../components/individual-components/InitForm";
import InitInput from "../components/individual-components/InitInput";
import { useGetter } from "../hooks/useGetter";
import sendId from "../etc/sendId";

const NoCharacterInterface = ({ gameId }: { gameId: string | null }) => {
    const [textInput, setTextInput] = useState('');
    const navigate = useNavigate();
    const { data: gameData, loading: gameLoading, error: gameError } = useGetter(`/api/v1/clientAccess`, { execute: true, method: 'GET' });
    const { request: clientRequest, loading: characterLoading, error: characterError } = useGetter('/api/v1/clientAccess/character', { execute: true, method: 'GET' });
    const [hideError, setHideError] = useState(false);

    useEffect(() => {
        if (!gameId) {
            navigate('/');
        }
    }, [gameId, navigate]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setHideError(false);
        e.preventDefault();
        clientRequest({ headers: { Authorization: `Bearer ${gameId}:${sendId(textInput)}` } }).then((data) => {
            console.log('data', data);
            navigate(`/${gameId}/${sendId(textInput)}`);
        });
        return false;
    }

    if (gameLoading || characterLoading) {
        return <div>Loading...</div>
    }

    if (gameError) {
        return <div>{JSON.stringify(gameError)}</div>
    }

    return gameData ? <div>
        <InitForm onSubmit={handleSubmit} label='Input Character Id' description={`Load a character into the game ${gameId}`}>
            {!hideError && characterError && <div className='text-lg font-bold text-center text-red-500'>{characterError.message}</div>}
            <div className='flex flex-row items-center justify-evenly'>
                <InitInput value={textInput} onChange={e => {
                    setHideError(false);
                    setTextInput(`${e.target.value}`)
                }} className='max-w-lg mx-auto text-2xl font-bold tracking-widest text-center' />

                <InitButton onPress={() => {
                    setTextInput('');
                    setHideError(true);
                }} className='ml-4 text-white bg-red-500 rounded-full'>Clear</InitButton>
            </div>
            <InitButton type='submit' className='max-w-md mx-auto text-xl font-bold tracking-wide'>Go to Game</InitButton>
        </InitForm>
    </div> : <div>Something went wrong</div>
}

export default NoCharacterInterface;
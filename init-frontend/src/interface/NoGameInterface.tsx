import InitForm from "../components/individual-components/InitForm";
import { useState } from "react";
import InitInput from "../components/individual-components/InitInput";
import InitButton from "../components/individual-components/InitButton";
import { useNavigate } from "react-router-dom";
import { useGetter } from "../hooks/useGetter";
import sendId from "../etc/sendId";

const NoGameInterface = () => {
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { request } = useGetter('/api/v1/clientAccess');


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        request({ params: {}, body: {}, headers: { Authorization: `Bearer ${sendId(textInput)}:` } }).then(() => {
            navigate(`/${textInput}`);
        }).catch((error) => {
            setError(error.message);
        });
        return false;
    }

    return <div className='flex-row items-center justify-center'>
        <InitForm onSubmit={handleSubmit} label='Navigate to game' description='Enter the code to navigate to the game' className={"flex flex-col items-center justify-center border-none"}>
            {error && <div className='text-lg font-bold text-center text-red-500'>{error}</div>}
            <div className='flex flex-row items-center justify-evenly'>
                <InitInput value={textInput} onChange={e => {
                    setError('');
                    setTextInput(`${e.target.value}`)
                }} className='max-w-lg mx-auto text-2xl font-bold tracking-widest text-center' />
                <InitButton className='ml-4 text-white bg-red-500 rounded-full' onPress={() => {
                    setError('');
                    setTextInput('');
                }}>Clear</InitButton>
            </div>
            <InitButton type='submit' className='max-w-md mx-auto text-xl font-bold tracking-wide bg-red'>Go to Character</InitButton>

        </InitForm>
    </div>
}

export default NoGameInterface;
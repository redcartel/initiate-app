import { useState } from "react";
import ReactionForm from "./ReactionForm";
import MovementForm from "./MovementForm";
import { Heading } from "react-aria-components";
import ActionForm from "./ActionForm";


const MainForm = ({ page }: { page: number, setPage: (page: number) => void }) => {
    const [finalReaction, setFinalReaction] = useState('');
    const [finalEarlyMove, setFinalEarlyMove] = useState('');
    const [finalAction, setFinalAction] = useState('');
    // const [finalBonus, setFinalBonus] = useState('');
    // const [finalLateMove, setFinalLateMove] = useState('');

    return (
        <>
            <Heading level={1} className="text-xl font-bold text-center">Enter Orders for Turn</Heading>
            <div className={page === 0 ? '' : 'hidden'}>
                <ReactionForm finalReaction={finalReaction} setFinalReaction={setFinalReaction} />
            </div>
            <div className={page === 1 ? '' : 'hidden'}>
                <MovementForm early finalMove={finalEarlyMove} setFinalMove={setFinalEarlyMove} />
            </div>
            <div className={page === 2 ? '' : 'hidden'}>
                <ActionForm actEarly={finalEarlyMove === 'none' || finalEarlyMove === ''} finalAction={finalAction} setFinalAction={setFinalAction} />
            </div>
        </>
    )
}

export default MainForm;

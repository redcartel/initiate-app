import { Heading } from "react-aria-components";
import { ColorPressIcon } from "../widgets/simple/ColorPressIcon";
import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons/faArrowAltCircleLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { CharacterSelectButton } from "../widgets/specific/CharacterSelectButton";
import { useState } from "react";
import { faArrowAltCircleRight } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

const characters = [
    {
        label: 'Red Fighter',
        id: 'red-fighter',
        description: 'A fighter with a red outfit.',
        iconLeft: <FontAwesomeIcon icon={faUser} />,
        longDescription: 'A fighter with a red outfit. He is a fighter and he is a fighter.',
        disabled: false
    },
    {
        label: 'Blue Fighter',
        id: 'blue-fighter',
        description: 'A fighter with a blue outfit.',
        iconLeft: <FontAwesomeIcon icon={faUser} />,
        disabled: false
    },
    {
        label: 'Red Wizard',
        id: 'red-wizard',
        description: 'A wizard with a red outfit.',
        iconLeft: <FontAwesomeIcon icon={faUser} />,
        longDescription: 'A wizard with a red outfit. He is a wizard and he is a wizard.',
        disabled: true
    },
    {
        label: 'Blue Wizard',
        id: 'blue-wizard',
        description: 'A wizard with a blue outfit.',
        iconLeft: <FontAwesomeIcon icon={faUser} />,
        longDescription: 'A wizard with a blue outfit. He is a wizard and he is a wizard.',
        disabled: false
    }
]

export const CharacterPicker = () => {

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [infoId, setInfoId] = useState<string | null>(null);
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center w-full gap-6 px-10 min-h-svh bg-cyan-900">
            <ColorPressIcon icon={faArrowAltCircleLeft} theme="action" size="lg" href="/" />
            <Heading className="text-4xl font-extrabold text-center text-amber-600">Pick Your Character</Heading>
            <Heading className="text-lg font-bold text-center text-cyan-50">"Capture the Flag #4"</Heading>
            <div className="flex flex-col items-center justify-center w-full gap-2">
                {characters.map((character) => (
                    <CharacterSelectButton key={character.id} characterPresentation={character} selectedId={selectedId} setSelectedId={setSelectedId} infoId={infoId} setInfoId={setInfoId} />
                ))}
                <div className="mt-4">
                    <ColorPressIcon isDisabled={selectedId === null} icon={faArrowAltCircleRight} theme="action" size="lg" onPress={() => {
                        if (selectedId) {
                            navigate(`/play/orders`);
                        }
                    }} />
                </div>
            </div>
        </div >
    )
}
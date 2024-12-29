import { Button } from "react-aria-components"
import { ColorButton } from "../simple/ColorButton"
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons/faCircleCheck";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons/faCircleQuestion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ButtonProps } from "react-aria-components";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons/faCircleXmark";

type CharacterSelectButtonProps = {
    characterPresentation: {
        label: string;
        description?: string;
        longDescription?: string;
        id: string;
        teamColor?: string;
        disabled?: boolean;
    },
    selectedId: string | null;
    setSelectedId: (id: string) => void;
    infoId: string | null;
    setInfoId: (id: string | null) => void;
} & ButtonProps

export const CharacterSelectButton = ({ characterPresentation, selectedId, setSelectedId, infoId, setInfoId, ...props }: CharacterSelectButtonProps) => {

    return (
        <div className="flex flex-col items-center justify-center w-full gap-2">
            <div className="flex flex-row items-center justify-between w-full gap-2">
                <div className='w-4 h-4'>
                    {selectedId === characterPresentation.id && <FontAwesomeIcon icon={faCircleCheck} className="text-lime-600" />}
                </div>
                <ColorButton isDisabled={characterPresentation.disabled} {...props} onPress={() => setSelectedId(characterPresentation.id)} className={`flex-grow`} style={{
                    borderColor: characterPresentation.teamColor ?? 'transparent',
                    borderWidth: 2,
                    borderStyle: 'solid',
                }}>
                    <div className="flex flex-col items-center justify-center w-full gap-2">
                        <div className="text-sm text-cyan-50">{characterPresentation.label}</div>
                        <div className="text-xs text-cyan-50">{characterPresentation.description}</div>
                    </div>
                </ColorButton>
                {characterPresentation.longDescription ? <Button className='w-4 h-4' onPress={() => infoId === characterPresentation.id ? setInfoId(null) : setInfoId(characterPresentation.id)}>
                    {infoId === characterPresentation.id ? <FontAwesomeIcon icon={faCircleXmark} className="text-blue-600" /> : <FontAwesomeIcon icon={faCircleQuestion} className="text-slate-900" />}
                </Button> : <div className='w-4 h-4' />}
            </div>
            {infoId === characterPresentation.id && <div className="flex flex-col items-center justify-center w-full gap-2">
                <div className="text-sm text-cyan-50">{characterPresentation.longDescription}</div>
            </div>}
        </div>
    )
}
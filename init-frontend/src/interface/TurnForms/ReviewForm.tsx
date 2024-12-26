import { Heading } from "@adobe/react-spectrum";
import { useAppState } from "../../hooks/useAppState";
import { CharacterSheet } from "../../hooks/useCharacterSheet";

export const ReviewForm = ({ characterSheet }: { characterSheet: CharacterSheet }) => {
    const { state } = useAppState();
    return (
        <div>
            <Heading level={2}>Review</Heading>
            <p>Review your orders for the turn</p>
            <div>
                {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    characterSheet?.turnPages.map((page: any, index: number) => (
                        <>
                            <div key={index}>{page.title}</div>
                            <div>{state.orders[page]}</div>
                        </>
                    ))
                }
            </div>
        </div>
    )
}
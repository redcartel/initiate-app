import { useEffect, useState } from "react";
import { Form, Heading, ListBox, Text } from "react-aria-components";
import InitListItem from "./individual-components/InitListItem";
import MovementFollowUp from "./MovementFollowUp";

const moveOptions = [
    ['none', 'None'],
    ['toward', 'Move Toward a Target'],
    ['precise', 'Specify a location'],
    ['other', 'Other']
]

const MovementForm = ({ early, finalMove, setFinalMove }: { early: boolean, finalMove: string, setFinalMove: (move: string) => void }) => {
    const [move, setMove] = useState(new Set('none'));
    const [followUp, setFollowUp] = useState(new Set(''));


    useEffect(() => {
        if (Array.from(move.values()).length === 0) {
            setMove(new Set(['none']));
        }
    }, [move])

    useEffect(() => {
        const moveString = Array.from(move)[0];
        if (moveString === 'toward' || moveString === 'precise' || moveString === 'other') {
            setFinalMove(moveString + ':' + Array.from(followUp)[0]);
        }
        else {
            setFinalMove(moveString);
        }
    }, [move, followUp, setFinalMove]);

    return (
        <Form onSubmit={() => undefined}>
            <Heading level={2} className="text-xl font-bold text-center">{early ? 'Early Movement' : 'Late Movement'}</Heading>
            <Text>
                {early ? 'Movement prior to acting, select none for immediate action at start of turn' : 'Movement after acting, you must have movement left over'}
            </Text>
            <ListBox aria-label='Movement' selectionMode="single" onSelectionChange={e => setMove(e as Set<string>)} selectedKeys={finalMove}>
                {moveOptions.map(([key, value]) => (
                    <InitListItem id={key} key={key} textValue={value} value={move}>
                        {value}
                    </InitListItem>
                ))}
            </ListBox>
            <MovementFollowUp move={move} setFollowUp={setFollowUp} followUp={followUp} />
        </Form>
    )
}

export default MovementForm;
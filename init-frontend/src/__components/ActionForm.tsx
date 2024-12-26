/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Heading, ListBox, Text } from "react-aria-components";
import InitListItem from "./individual-components/InitListItem";

const actionOptions = [
    ['none', 'None'],
    ['attack', 'Attack'],
    ['magic', 'Magic'],
    ['utilize', 'Utilize Item or Object'],
    ['help', 'Help'],
    ['dash', 'Dash'],
    ['disengage', 'Disengage'],
    ['ready-action', 'Ready Action'],
    ['influence', 'Influence'],
    ['hide', 'Hide'],
    ['search', 'Search'],
    ['study', 'Study'],
]

const ActionForm = ({ actEarly, finalAction, setFinalAction }: { actEarly: boolean, finalAction: string, setFinalAction: (action: string) => void }) => {
    const [action, setAction] = useState(new Set(['none']));
    const [followUp, setFollowUp] = useState(new Set(['']));

    useEffect(() => {
        if (Array.from(action.values()).length === 0) {
            setAction(new Set(['none']));
        }
    }, [action])

    useEffect(() => {
        setFinalAction(Array.from(action)[0] + ':' + Array.from(followUp)[0]);
    }, [action, followUp, setFinalAction]);

    return (
        <>
            <Heading level={2} className="text-xl font-bold text-center">Action</Heading>
            <Text>
                {actEarly ? 'Act Immediately' : 'Act After Early Movement'}
            </Text>
            <ListBox onSelectionChange={(e) => setAction(e as Set<string>)} selectionMode="single" selectedKeys={action}>
                {actionOptions.map(([key, value]) => (
                    <InitListItem id={key} key={key} textValue={value} value={action}>
                        {value}
                    </InitListItem>
                ))}
            </ListBox >
            {/* <ActionFollowUp action={action} setFollowUp={setFollowUp} followUp={followUp} /> */}
        </>
    )
}

export default ActionForm;
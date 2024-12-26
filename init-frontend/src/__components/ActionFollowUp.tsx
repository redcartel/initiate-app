import { useState } from "react";
import { Heading, ListBox, TextArea } from "react-aria-components";
import InitListItem from "./individual-components/InitListItem";

const followUpActions = {
    'none': null,
    'dash': null,
    'disengage': null,
    'ready-action': [
        ['Select Triggering Incident', [
            ['enemy-adjacent-or-end', 'Adjacent to enemy or turn ends'],
            ['enemy-enters-range', 'Enemy enters range'],
            ['enemy-enters-range-no-cover', 'Enemy enters range with no cover'],
            ['3+-enemies-in-range-area-of-effect', '3+ enemies in range in area of effect'],
            ['ally-adjacent', 'Ally adjacent'],
            ['enemy-adjacent-to-ally', 'Enemy adjacent to ally'],
            ['ally-enters-range', 'Ally enters range'],
            ['other', 'Other']
        ]],
        ['Restrict Target', '->'],
        ['Select Action', [
            ['attack-melee', 'Attack Triggering Enemy, Prefer Melee'],
            ['attack-ranged', 'Attack Triggering Enemy, Prefer Ranged'],
            ['magic', 'Cast a Spell', '??'],
            ['move', 'Make post-action move immediately'],
            ['other', 'Other']
        ]],
    ],
    'hide': null,
    'search': [['Select Skill', [
        ['perception', 'Perception'],
        ['insight', 'Insight'],
        ['medicine', 'Medicine'],
        ['survival', 'Survival'],
    ]]],
    'study': [['Select Skill', [
        ['investigation', 'Investigation'],
        ['arcana', 'Arcana'],
        ['history', 'History'],
        ['nature', 'Nature'],
        ['religion', 'Religion'],
    ]]],
    'influence': [['Select Skill', [
        ['persuasion', 'Persuasion'],
        ['intimidation', 'Intimidation'],
        ['deception', 'Deception'],
        ['performance', 'Performance'],
    ]]],
    'utilize-item': 'Name the Item or Object',
    'help': [
        ['Select Who You Are Helping', '->'],
        ['Select action', [
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
        ]]],
    'attack': [
        ['Select Target', '->'],
        ['Select Weapon', 'XX']
    ],
    'magic': [
        ['Select Spell', '??']
    ]
}

const ActionFollowUp = ({ action, setFollowUp, followUp }: { action: Set<string>, setFollowUp: (followUp: Set<string>) => void, followUp: Set<string> }) => {
    const [appState] = useAppState();

    const [choices, setChoices] = useState<string[]>([]);
    const [notes, setNotes] = useState('');

    const updateChoice = (index: number, value: string) => {
        const newChoices: string[] = [...choices];
        while (newChoices.length < index + 1) {
            newChoices.push('');
        }
        newChoices[index] = value;
        setChoices(newChoices);
    }

    const actionTypeKey = (Array.from(action)[0] ?? 'none') as keyof typeof followUpActions;
    const actionInstructions = followUpActions[actionTypeKey];

    return (
        <>
            {
                !!actionInstructions &&
                <>
                    <Heading>Notes on Action</Heading>
                    <TextArea value={notes} onChange={e => setNotes(e.target.value)} />
                </>
            }
            {
                typeof actionInstructions === 'string' &&
                <>
                    <Heading>{actionInstructions}</Heading>
                    <TextArea value={notes} onChange={e => setNotes(e.target.value)} />
                </>
            }
            {
                Array.isArray(actionInstructions) &&
                <>
                    {
                        actionInstructions.map(([label, option], index) => (
                            <>
                                <Heading key={index}>{label}</Heading>
                                <>
                                    {Array.isArray(option) &&
                                        <ListBox selectedKeys={new Set([choices[index]])} onSelectionChange={e => updateChoice(index, Array.from(e as Set<string>)[0] ?? '')}>
                                            {option.map(([value, label]) => (
                                                <InitListItem key={value} value={new Set([value])} textValue={value} id={value}>{label}</InitListItem>
                                            ))}
                                        </ListBox>
                                    }
                                </>
                            </>
                        ))
                    }
                    <TextArea value={notes} onChange={e => setNotes(e.target.value)} />

                </>
            }
        </>
    )
}
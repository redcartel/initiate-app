import { useEffect, useState } from "react";
import { Input, Label, ListBox } from "react-aria-components";
import InitListItem from "./individual-components/InitListItem";

const towardOptions = [
    ['red-fighter', 'Red Fighter'],
    ['red-cleric', 'Red Cleric'],
    ['red-sorcerer', 'Red Sorcerer'],
    ['blue-fighter', 'Blue Fighter'],
    ['blue-cleric', 'Blue Cleric'],
    ['blue-sorcerer', 'Blue Sorcerer'],
    ['red-flag', 'Red Flag'],
    ['blue-flag', 'Blue Flag'],
    ['red-base', 'Red Base'],
    ['blue-base', 'Blue Base'],
    ['bridge', 'Bridge'],
    ['south-house', 'South House'],
    ['north-house', 'North House'],
    ['other', 'Other']
]

const MovementFollowUp = ({ move, setFollowUp, followUp }: { move: Set<string>, setFollowUp: (followUp: Set<string>) => void, followUp: Set<string> }) => {
    const [ns, setNS] = useState(0);
    const [ew, setEW] = useState(0);
    const [choice, setChoice] = useState(new Set(''));
    const [other, setOther] = useState('');

    useEffect(() => {
        if (move.has('precise')) {
            const nsDir = ns >= 0 ? 'N' : 'S';
            const ewDir = ew >= 0 ? 'E' : 'W';
            setFollowUp(new Set([`${Math.abs(ns)}${nsDir}:${Math.abs(ew)}${ewDir}`]));
        }
        else if (choice.has('other')) {
            setFollowUp(new Set(['other' + ':' + other]));
        }
        else {
            setFollowUp(choice);
        }
    }, [move, setFollowUp, ns, ew, choice, other]);

    if (move.has('toward')) {
        return <>
            <Label slot='label' className="text-xl font-bold text-center">Movement</Label>
            <ListBox aria-label='Movement' selectionMode="single" onSelectionChange={e => setChoice(e as Set<string>)} selectedKeys={choice}>
                {towardOptions.map(([id, value]) => (
                    <InitListItem id={id} key={id} textValue={value} value={followUp}>
                        {value}
                    </InitListItem>
                ))}
            </ListBox>
            {
                followUp.has('other') && <Input className="w-full h-10 p-2 bg-gray-200 border-blue-200 rounded-md caret-black" aria-label="Other Movement" value={other} onChange={e => setOther(e.target.value)} />
            }
        </>
    }
    else if (move.has('precise')) {
        return <>
            <Label slot='label' className="text-xl font-bold text-center">Precise Movement</Label>
            <div className="flex flex-col gap-4 p-4">
                <div>
                    <Label>North-South: {Math.abs(ns)}ft {ns >= 0 ? 'North' : 'South'}</Label>
                    <input
                        type="range"
                        min="-50"
                        max="50"
                        step="5"
                        value={ns}
                        onChange={(e) => {
                            const newNS = parseInt(e.target.value);
                            setNS(newNS);
                        }}
                        className="w-full"
                    />
                </div>
                <div>
                    <Label>East-West: {Math.abs(ew)}ft {ew >= 0 ? 'East' : 'West'}</Label>
                    <input
                        type="range"
                        min="-50"
                        max="50"
                        step="5"
                        value={ew}
                        onChange={(e) => {
                            const newEW = parseInt(e.target.value);
                            setEW(newEW);
                        }}
                        className="w-full"
                    />
                </div>
            </div>
        </>
    }
    else if (move.has('other')) {
        return <>
            <Label slot='label' className="text-xl font-bold text-center">Other Movement</Label>
            <div className="flex flex-row w-full p-4">
                <Input className="w-full h-10 p-2 bg-gray-200 border-blue-200 rounded-md caret-black" aria-label="Other Movement" value={Array.from(choice)[0]} onChange={e => setChoice(new Set([e.target.value]))} />
            </div>
        </>
    }
}

export default MovementFollowUp;
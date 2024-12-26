import { Input, Label, ListBox } from "react-aria-components"
import InitListItem from "./individual-components/InitListItem"

const followUpOptions = {
    'other': ['__other__'],
    'magic': [
        ['shield', 'Shield'],
        ['absorb-elements', 'Absorb Elements'],
        ['counterspell', 'Counterspell (Ask)']
    ]
}

export const ReactionFollowUp = ({ reaction, setFollowUp, followUp }: { reaction: Set<string>, setFollowUp: (followUp: Set<string>) => void, followUp: Set<string> }) => {
    return (
        <>
            {Object.keys(followUpOptions).map(key => {
                if (reaction.has(key) && key === 'other') {
                    return <>
                        <Label slot='label' className="text-xl font-bold text-center">Other Reaction</Label>
                        <div className="flex flex-row w-full p-4">
                            <Input className="w-full h-10 p-2 bg-gray-200 border-blue-200 rounded-md caret-black" aria-label="Other Reaction" value={Array.from(followUp)[0]} onChange={e => setFollowUp(new Set([e.target.value]))} />
                        </div>
                    </>
                }
                else if (reaction.has(key) && new Set(['magic']).has(key)) {
                    return <>
                        <Label slot='label' className="text-xl font-bold text-center">{key === 'magic' ? 'Spell Selection' : 'Choose Option'}</Label>
                        <ListBox aria-label='Reaction' selectionMode="single" onSelectionChange={e => setFollowUp(e as Set<string>)} selectedKeys={followUp}>
                            {followUpOptions['magic'].map(([id, value]) => (
                                <InitListItem id={id} key={id} textValue={value} value={followUp}>
                                    {value}
                                </InitListItem>
                            ))}
                        </ListBox>
                    </>
                }
            })}
        </>

    )
}

export default ReactionFollowUp;
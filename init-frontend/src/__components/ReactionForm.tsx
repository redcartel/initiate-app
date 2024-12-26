/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form, Heading, ListBox } from 'react-aria-components';
import { useEffect, useState } from 'react';
import InitListItem from './individual-components/InitListItem';
import { ReactionFollowUp } from './ReactionFollowUp';

const reactionOptions = [['none', 'None'], ['opportunity-attack', 'First Opportunity Attack'], ['bm-reposte', 'Battle Master Reposte'], ['readied-action', 'Readied Action'], ['magic', 'Magic'], ['other', 'Other']];

export default function ReactionForm({ finalReaction, setFinalReaction }: { finalReaction: string, setFinalReaction: (reaction: string) => void }) {

    const [reaction, setReaction] = useState<Set<string>>(new Set(['none']));
    const [followUp, setFollowUp] = useState<Set<string>>(new Set(['none']));

    useEffect(() => {
        if (Array.from(reaction.values()).length === 0) {
            setReaction(new Set(['none']));
        }
    }, [reaction])

    useEffect(() => {
        const reactionString = Array.from(reaction.values())[0];

        if (reactionString === 'none') {
            setFinalReaction('');
        }
        else if (reactionString === 'magic' || reactionString === 'other') {
            setFinalReaction(`${reactionString}:${Array.from(followUp.values())[0]}`);
        }
    }, [reaction, followUp])

    return (
        <>
            <Form onSubmit={() => undefined}>
                <div className="flex flex-col">
                    <Heading level={2} className="text-xl font-bold text-center">Reaction</Heading>
                    <ListBox aria-label='Reaction' selectionMode="single" onSelectionChange={e => setReaction(e as Set<string>)} selectedKeys={reaction}>
                        {reactionOptions.map(([key, value]) => (
                            <InitListItem id={key} key={key} textValue={value} value={reaction}>
                                {value}
                            </InitListItem>
                        ))}
                    </ListBox>
                    <ReactionFollowUp reaction={reaction} setFollowUp={setFollowUp} followUp={followUp} />
                </div>
            </Form >
        </>
    );
}

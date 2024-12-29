import { Heading, Text } from "react-aria-components";
import { ColorButton } from "../widgets/simple/ColorButton";

export const Welcome = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full gap-4 px-10 min-h-svh bg-cyan-900">
            <Heading className="text-4xl font-extrabold text-amber-600">Initiate!</Heading>
            <Heading className="text-2xl font-bold text-slate-200">by Creation Games</Heading>
            <Text className="text-lg italic text-center text-slate-200">
                Order entry and simultaneous initiative tracking for D20 Tactics and other <em>5e</em> games.
            </Text>
            <div className="flex flex-row items-center justify-center w-full gap-4">
                <ColorButton theme="action" size="md" href="/play">
                    Play
                </ColorButton>
                <ColorButton href="/gm">
                    GM
                </ColorButton>
            </div>
        </div>
    )
}
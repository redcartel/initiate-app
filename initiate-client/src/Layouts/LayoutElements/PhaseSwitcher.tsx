import { PhaseLink } from "../../QueryTypes/getResponse";
import { CGButton } from "../../Components/CGButton";

export function PhaseSwitcherContents({ phaseLinks }: { phaseLinks: PhaseLink[] }) {
    return <>
        {phaseLinks.map(phaseLink => <CGButton key={phaseLink.href} href={phaseLink.href!} theme={ window.location.pathname.startsWith(phaseLink.href!) ? 'tertiary' : phaseLink.theme} size="md">{phaseLink.label}</CGButton>)}
    </>
}
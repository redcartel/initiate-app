import { ColorPressIcon } from "../simple/ColorPressIcon"
import { faArrowsToEye } from "@fortawesome/free-solid-svg-icons"
import { faShoePrints } from "@fortawesome/free-solid-svg-icons"
export const TurnFooter = () => {
    return (
        <footer className="flex flex-row items-center w-full p-2 border-t-2 h-14 justify-evenly bg-amber-200 text-amber-600 border-amber-900">
            <ColorPressIcon icon={faArrowsToEye} size="sm" theme="main-nav" />
            <ColorPressIcon icon={faShoePrints} size="sm" theme="main-nav" />
        </footer>
    )
}
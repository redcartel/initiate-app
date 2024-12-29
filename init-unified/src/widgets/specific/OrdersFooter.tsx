import { faScroll } from "@fortawesome/free-solid-svg-icons/faScroll"
import { ColorPressIcon } from "../simple/ColorPressIcon"

export const OrdersFooter = () => {
    return (
        <footer className="flex flex-row items-center justify-center w-full p-2 border-t-2 h-14 bg-amber-200 text-amber-600 border-amber-900">
            <ColorPressIcon icon={faScroll} size="sm" theme="main-nav" />
        </footer>
    )
}
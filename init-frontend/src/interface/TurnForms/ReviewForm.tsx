import { Heading, Text } from "react-aria-components";
import { useAppState } from "../../hooks/useAppState";
import { CharacterSheet } from "../../hooks/useCharacterSheet";
import InitButton from "../../components/individual-components/InitButton";

export const ReviewForm = ({ characterSheet }: { characterSheet: CharacterSheet }) => {
    const { state } = useAppState();

    return (
        <div>
            <Heading level={2} className="text-2xl font-bold text-center">Review</Heading>
            <div className="flex flex-col items-center">
                <Text className="text-center text-gray-500 text-m">Review your orders for the turn</Text>
            </div>
            <div>
                {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    characterSheet?.turnPages.map((page: any, index: number) => {
                        const pageOrders = state.orders && state.orders[index];
                        return <>
                            <Heading className="mt-4 text-xl font-bold text-center border-b-2 border-b-black" level={3} key={index}>{page.title}</Heading>

                            {
                                Object.entries(pageOrders).length > 0 ?
                                    pageOrders && Object.entries(pageOrders).map(([key, value]) => (
                                        <div key={key} className='text-center text-gray-950 text-m'><span className="font-bold">{key}:</span> {`${value}`}</div>
                                    )) :
                                    <div className="text-center">
                                        <Text className="text-center text-red-800 text-m">No orders for this page</Text>
                                    </div>
                            }
                        </>

                    })
                }
            </div>
            <div className="flex flex-col gap-2">
                <InitButton className="mt-4 text-green-100 bg-green-600" type="submit">
                    Submit Orders
                </InitButton>
            </div>
        </div >
    )
}
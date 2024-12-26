import { useCallback } from "react";
import { GetterOptions } from "./useGetter";

const useFakeGetter = (endpoint: string, options: GetterOptions = {}) => {
    const { params } = options;

    const _params = params;

    const get = useCallback(async ({ params }: { params: Record<string, string> }) => {

        const fetchParams = { ..._params, ...params };

        if (endpoint === "/api/v1/character-sheets" && fetchParams.characterId === "123" && fetchParams.gameId === "abc") {
            return {
                characterSheet: {
                    name: "John Doe",
                    turnPages: [
                        {
                            title: "Movement before Action",
                            question: {
                                "type": "select",
                                "title": "Act Immediately or Move?",
                                "description": `
<p>If you act immediately, you take an action at the first chance, but don't move until everyone has acted.<p>
<p>If you move, you will move before non-immediate actions and then take a non-immediate action, followed by late turn movement.</p>
                                `,
                                "key": "moveType",
                                "default": "move",
                                "options": [
                                    { "label": "Act Immediately, Move Later", "value": "skip" },
                                    { "label": "Move Before Action", "value": "move" }
                                ],
                                "followUp": {
                                    "move": {
                                        "type": "text",
                                        "title": "Describe your movement",
                                        "description": "If you take the dash action later, you may move extra distance here",
                                        "key": "moveDescription",
                                    }
                                }
                            }
                        },
                        {
                            title: "Action",
                            description: "Your turn's action",
                            question: {
                                "type": "text",
                                "title": "What do you want to do?",
                                "description": "Describe your action",
                                "key": "action",
                            }
                        },
                        {
                            title: "Move after Action",
                            description: "Movement after all characters have acted",
                            question: {
                                "type": "text",
                                "title": "Where do you want to move?",
                                "description": "Describe your movement",
                                "key": "moveDescription",
                            }
                        },
                        {
                            title: "Reaction",
                            description: "How you use your reaction this turn",
                            question: {
                                "type": "text",
                                "title": "What do you want to do?",
                                "description": "Describe your action",
                                "key": "reaction",
                            }
                        }
                    ]
                },
                characterDescription: "<p>John Doe is a 30 year old man who is a wizard.</p><p>got it?</p>"
            }
        }
        else {
            return {
                characterSheet: null,
                characterDescription: null
            }
        }
    }, [_params, endpoint]);

    return get;
}

export default useFakeGetter;
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
                                "key": "moveType",
                                "default": "move",
                                "options": [
                                    { "label": "Act Immediately, Move Later", "value": "skip", "description": 'You will act before any character moves, you will not move until after everyone takes actions' },
                                    { "label": "Move Before Action", "value": "move", "description": 'You will move before characters that did not act immediately take actions' }
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
                                "title": "Describe your action",
                                "key": "action",
                            }
                        },
                        {
                            title: "Move after Action",
                            description: "Movement after all characters have acted",
                            question: {
                                "type": "text",
                                "title": "Describe your movement",
                                "key": "moveDescription",
                            }
                        },
                        {
                            title: "Reaction",
                            description: "How you use your reaction this turn",
                            question: {
                                "type": "text",
                                "title": "Describe your reaction",
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
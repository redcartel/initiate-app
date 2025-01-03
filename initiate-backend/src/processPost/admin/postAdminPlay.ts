import { gameState } from "../..";
import { PostBody } from "../../../../initiate-client/src/QueryTypes/postBody";
import { PostResponse } from "../../../../initiate-client/src/QueryTypes/postResponse";
import { Params } from "../../processGet";
import { AdminState } from "../../types";

export function postAdminPlay(params: Params, body: PostBody) : PostResponse {
    // console.log'postAdminPlay', params, body);
    const path = decodeURIComponent(params.path);
    const pathSegments = path.split('/');
    const sessionKey = decodeURIComponent(params.sessionKey);

    if (!sessionKey) {
        return {
            '!errorMsg': 'You are not an admin',
            '!redirect': '/'
        }
    }
    
    if (pathSegments.length < 3 || pathSegments[0] !== 'admin' || pathSegments[1] !== 'play') {
        return {
            '!errorMsg': 'Invalid path',
            '!redirect': '/admin/play'
        }
    }

    const phase = pathSegments[2] as keyof AdminState['playState']['dropDownChecked'];

    const value = body.value as string[];

    if (!gameState.adminState) {
        gameState.adminState = {
            playState: {
                dropDownChecked: {
                    reaction: [],
                    action1: [],
                    move1: [],
                    action2: [],
                    move2: []
                }
            }
        }
    }

    if (!gameState.adminState.playState.dropDownChecked[phase]) {
        gameState.adminState.playState.dropDownChecked[phase] = [];
    }

    gameState.adminState.playState.dropDownChecked[phase] = value;

    return {
        '!resetPost': true
    }
}
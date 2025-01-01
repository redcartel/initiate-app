import { PostBody } from "../../../initiate-client/src/QueryTypes/postBody";
import { PostResponse } from "../../../initiate-client/src/QueryTypes/postResponse";
import { Params } from "../processGet";

export function processPost(body: PostBody, params: Params): PostResponse {
    console.log('processPost', body, params);
    const path = decodeURIComponent(params.path);
    console.log('path', path);
    let response: PostResponse = {
        '!redirect': '/err'
    };

    if (path === 'client/join') {
        response = {
            '!redirect': '/client/character'
        }
    }

    console.log('response', response);
    return response;
}
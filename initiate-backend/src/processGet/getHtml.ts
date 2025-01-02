import fs from 'fs';
import { Response } from 'express';
export function sendHtml(path: string, res: Response) {
    const pathSegments = path.split('/');
    console.log(pathSegments);
    if (pathSegments[0] !== 'html') {
        throw new Error('getHtml called with non-html path');
    }
    const htmlPath = pathSegments.slice(1).join('/');

    const cwd = process.cwd();
    if (htmlPath.endsWith('.html') || htmlPath.endsWith('.htm') || htmlPath.endsWith('.css') || htmlPath.endsWith('.js') || htmlPath.endsWith('.json') || htmlPath.endsWith('.txt')) {
        let html = fs.readFileSync(`${cwd}/html/${htmlPath}`, 'utf8');
        html = html.replace("href='/html/", `href='${process.env.BASE_URL ?? 'http://localhost:3031'}/html/`);
        html = html.replace("href=\"/html/", `href="${process.env.BASE_URL ?? 'http://localhost:3031'}/html/`);
        html = html.replace("src='/html/", `src='${process.env.BASE_URL ?? 'http://localhost:3031'}/html/`);
        html = html.replace("src=\"/html/", `src="${process.env.BASE_URL ?? 'http://localhost:3031'}/html/`);
        res.status(200).send(html);
    }
    else if (htmlPath.endsWith('.png') || htmlPath.endsWith('.jpg') || htmlPath.endsWith('.jpeg') || htmlPath.endsWith('.gif') || htmlPath.endsWith('.svg')) {
        const data = fs.readFileSync(`${cwd}/html/${htmlPath}`);
        res.set('Content-Type', 'image/*');
        res.status(200).send(data);
    }
    return res;
}
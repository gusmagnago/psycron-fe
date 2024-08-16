/* eslint-disable no-console */
import { writeFileSync } from 'fs';

const robotsTxtContent = `
User-agent: *
Disallow:

Sitemap: https://psycron.app/sitemap.xml
`;

writeFileSync('./public/robots.txt', robotsTxtContent);

console.log('robots.txt gerado com sucesso!');

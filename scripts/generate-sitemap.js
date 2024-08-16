/* eslint-disable no-console */
import { createWriteStream } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';

const routes = [
	{ url: '/', changefreq: 'monthly', priority: 1.0 },
	{ url: '/sign-in', changefreq: 'monthly', priority: 0.7 },
	{ url: '/sign-up', changefreq: 'monthly', priority: 0.7 },
];

const sitemapStream = new SitemapStream({ hostname: 'https://psycron.app' });
const writeStream = createWriteStream('./public/sitemap.xml');

routes.forEach((route) => {
	sitemapStream.write(route);
});

sitemapStream.end();

streamToPromise(sitemapStream)
	.then((data) => writeStream.write(data.toString()))
	.catch((err) => {
		console.error('Erro ao gerar o sitemap:', err);
	});

console.log('Sitemap gerado com sucesso!');

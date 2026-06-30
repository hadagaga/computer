// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	site: 'https://computer.hada.asia',
	integrations: [
		starlight({
			title: '计算机体系视频百科',
			description: '以视频、学习路径和知识关联组织计算机体系知识。',
			customCss: ['./src/styles/custom.css'],
			sidebar: [
				{
					label: '开始',
					items: [{ label: '项目首页', slug: 'index' }],
				},
				{
					label: '图谱探索',
					collapsed: false,
					items: [
						{ label: '全局知识图', link: '/graph/' },
						{ label: '节点文档', link: '/nodes/' },
						{ label: '路径库', link: '/paths/' },
						{ label: '一次 TCP 连接', link: '/paths/tcp-connection/' },
					],
				},
				{
					label: '节点详情',
					collapsed: false,
					items: [
						{ label: 'TCP', slug: 'nodes/tcp' },
						{ label: 'IP', slug: 'nodes/ip' },
						{ label: 'Socket', slug: 'nodes/socket' },
						{ label: 'SYN Flood', slug: 'nodes/syn-flood' },
					],
				},
				{
					label: '领域',
					collapsed: true,
					items: [
						{ label: '领域索引', slug: 'domains' },
						{ label: '计算机网络', slug: 'domains/network' },
						{ label: '网络安全', slug: 'domains/security' },
					],
				},
			],
		}),
		react(),
	],
});

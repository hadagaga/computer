// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://hada.asia',
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
					label: '第一阶段：TCP 路径',
					collapsed: false,
					items: [
						{ label: 'TCP 节点', slug: 'nodes/tcp' },
						{ label: '一次 TCP 连接', slug: 'paths/tcp-connection' },
						{ label: 'TCP 周边知识网', slug: 'graph/tcp' },
					],
				},
				{
					label: '节点库',
					collapsed: false,
					items: [
						{ label: '节点索引', slug: 'nodes' },
						{ label: 'IP', slug: 'nodes/ip' },
						{ label: 'Socket', slug: 'nodes/socket' },
						{ label: 'SYN Flood', slug: 'nodes/syn-flood' },
					],
				},
				{
					label: '路径树',
					collapsed: true,
					items: [{ label: '路径索引', slug: 'paths' }],
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
	],
});

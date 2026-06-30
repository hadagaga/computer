import { useEffect, useRef, useState } from 'react';
import cytoscape, { type Core, type ElementDefinition } from 'cytoscape';

type NodeRecord = {
	id: string;
	title: string;
	domain: string;
	types: string[];
	status: string;
	summary: string;
	url: string | null;
	tags: string[];
};

type EdgeRecord = {
	id: string;
	source: string;
	target: string;
	label: string;
	description: string;
};

type Props = {
	nodes: NodeRecord[];
	edges: EdgeRecord[];
	initialNode?: string;
	navigateOnDoubleClick?: boolean;
};

const domainNames: Record<string, string> = {
	application: '应用',
	network: '计算机网络',
	security: '网络安全',
	system: '操作系统',
};

export default function KnowledgeGraph({ nodes, edges, initialNode, navigateOnDoubleClick = false }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const graphRef = useRef<Core | null>(null);
	const [selectedId, setSelectedId] = useState(initialNode ?? '');
	const selected = nodes.find((node) => node.id === selectedId) ?? null;
	const relationCount = selected
		? edges.filter((edge) => edge.source === selected.id || edge.target === selected.id).length
		: 0;

	useEffect(() => {
		if (!containerRef.current) return;

		const elements: ElementDefinition[] = [
			...nodes.map((node) => ({ data: node })),
			...edges.map((edge) => ({ data: edge })),
		];

		const graph = cytoscape({
			container: containerRef.current,
			elements,
			layout: { name: 'cose', animate: false, fit: true, padding: 36, nodeRepulsion: 9000 },
			minZoom: 0.35,
			maxZoom: 2.2,
			style: [
				{
					selector: 'node',
					style: {
						label: 'data(title)',
						'font-family': 'system-ui, sans-serif',
						'font-size': 12,
						'font-weight': 700,
						color: '#e2e8f0',
						'text-valign': 'center',
						'text-halign': 'center',
						'text-wrap': 'wrap',
						'text-max-width': '86px',
						width: 78,
						height: 78,
						'background-color': '#2563eb',
						'border-width': 2,
						'border-color': '#60a5fa',
						'transition-property': 'opacity, border-width, border-color',
						'transition-duration': 180,
					},
				},
				{ selector: 'node[domain = "security"]', style: { 'background-color': '#be123c', 'border-color': '#fb7185' } },
				{ selector: 'node[domain = "system"]', style: { 'background-color': '#7c3aed', 'border-color': '#a78bfa' } },
				{ selector: 'node[domain = "application"]', style: { 'background-color': '#047857', 'border-color': '#34d399' } },
				{
					selector: 'edge',
					style: {
						width: 1.5,
						'line-color': '#64748b',
						'curve-style': 'bezier',
						opacity: 0.72,
					},
				},
				{ selector: '.is-muted', style: { opacity: 0.13 } },
				{ selector: '.is-selected', style: { 'border-width': 5, 'border-color': '#fbbf24' } },
			],
		});

		const focusNode = (id: string) => {
			const node = graph.getElementById(id);
			graph.elements().addClass('is-muted');
			node.closedNeighborhood().removeClass('is-muted');
			graph.nodes().removeClass('is-selected');
			node.addClass('is-selected');
			setSelectedId(id);
		};

		const openNodeDocument = (id: string) => {
			const record = nodes.find((node) => node.id === id);
			if (navigateOnDoubleClick && record?.url) window.location.assign(record.url);
		};

		graph.on('tap', 'node', (event) => focusNode(event.target.id()));
		graph.on('dbltap', 'node', (event) => openNodeDocument(event.target.id()));
		graph.on('tap', (event) => {
			if (event.target === graph) {
				graph.elements().removeClass('is-muted is-selected');
				setSelectedId('');
			}
		});

		graphRef.current = graph;
		if (initialNode) focusNode(initialNode);

		return () => {
			graph.destroy();
			graphRef.current = null;
		};
	}, [edges, initialNode, navigateOnDoubleClick, nodes]);

	return (
		<div className="knowledge-graph-shell">
			<div className="graph-canvas-wrap">
				<div className="graph-toolbar">
					<span>{navigateOnDoubleClick ? '拖动画布 · 滚轮缩放 · 单击选中 · 双击进入文档' : '拖动画布 · 滚轮缩放 · 点击节点聚焦一跳关系'}</span>
					<button type="button" onClick={() => graphRef.current?.fit(undefined, 36)}>适应画布</button>
				</div>
				<div ref={containerRef} className="knowledge-graph-canvas" aria-label="节点知识关系图" />
			</div>
			<aside className="graph-preview" aria-live="polite">
				{selected ? (
					<>
						<div className="preview-eyebrow">{domainNames[selected.domain] ?? selected.domain}</div>
						<h2>{selected.title}</h2>
						<p>{selected.summary}</p>
						<dl className="preview-stats">
							<div><dt>直接关系</dt><dd>{relationCount}</dd></div>
							<div><dt>内容状态</dt><dd>{selected.status === 'planned' ? '规划中' : selected.status}</dd></div>
						</dl>
						<div className="tag-row">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
						{selected.url ? <a className="preview-link" href={selected.url}>进入节点详情 <span>→</span></a> : <p className="preview-unavailable">详情页待建立</p>}
					</>
				) : (
					<div className="preview-empty"><strong>选择一个节点</strong><p>查看它的说明、状态和直接关系。</p></div>
				)}
			</aside>
		</div>
	);
}

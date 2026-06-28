import { useMemo, useState } from 'react';
import {
	Background,
	Controls,
	MarkerType,
	ReactFlow,
	type Edge,
	type Node,
	type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type NodeRecord = { id: string; title: string; summary: string; domain: string; url: string | null };
type Branch = { from: string; title: string; nodes: string[] };
type PathRecord = { mainline: string[]; branches: Branch[] };
type Participation = { node: string; role: string; position: string; description: string };

type Props = {
	path: PathRecord;
	nodeRecords: NodeRecord[];
	participation: Participation[];
};

export default function PathFlow({ path, nodeRecords, participation }: Props) {
	const [selectedId, setSelectedId] = useState(path.mainline[0]);
	const records = useMemo(() => new Map(nodeRecords.map((node) => [node.id, node])), [nodeRecords]);
	const roles = useMemo(() => new Map(participation.map((item) => [item.node, item])), [participation]);

	const { flowNodes, flowEdges } = useMemo(() => {
		const nodes: Node[] = path.mainline.map((id, index) => ({
			id,
			position: { x: index * 210, y: 70 },
			data: { label: records.get(id)?.title ?? id },
			className: `flow-node flow-node--main flow-node--${records.get(id)?.domain ?? 'network'}`,
			draggable: false,
		}));
		const edges: Edge[] = path.mainline.slice(1).map((id, index) => ({
			id: `main-${path.mainline[index]}-${id}`,
			source: path.mainline[index],
			target: id,
			markerEnd: { type: MarkerType.ArrowClosed },
			className: 'flow-edge flow-edge--main',
		}));

		path.branches.forEach((branch, branchIndex) => {
			const sourceIndex = path.mainline.indexOf(branch.from);
			branch.nodes.forEach((id, nodeIndex) => {
				nodes.push({
					id,
					position: { x: Math.max(0, sourceIndex * 210 + (nodeIndex - (branch.nodes.length - 1) / 2) * 155), y: 250 + branchIndex * 145 },
					data: { label: records.get(id)?.title ?? id },
					className: `flow-node flow-node--branch flow-node--${records.get(id)?.domain ?? 'network'}`,
					draggable: false,
				});
				edges.push({
					id: `${branch.from}-${id}`,
					source: branch.from,
					target: id,
					label: nodeIndex === 0 ? branch.title : undefined,
					markerEnd: { type: MarkerType.ArrowClosed },
					className: 'flow-edge flow-edge--branch',
				});
			});
		});

		return { flowNodes: nodes, flowEdges: edges };
	}, [path, records]);

	const selected = records.get(selectedId);
	const selectedRole = roles.get(selectedId);
	const onNodeClick: NodeMouseHandler = (_, node) => setSelectedId(node.id);

	return (
		<div className="path-flow-shell">
			<div className="path-flow-canvas" aria-label="TCP 连接学习路径图">
				<ReactFlow
					nodes={flowNodes}
					edges={flowEdges}
					onNodeClick={onNodeClick}
					fitView
					fitViewOptions={{ padding: 0.15 }}
					minZoom={0.35}
					maxZoom={1.8}
					nodesConnectable={false}
					proOptions={{ hideAttribution: true }}
				>
					<Background gap={24} size={1} />
					<Controls showInteractive={false} />
				</ReactFlow>
			</div>
			<aside className="graph-preview" aria-live="polite">
				{selected && selectedRole ? (
					<>
						<div className="preview-eyebrow">{selectedRole.position === 'mainline' ? '主线节点' : '分支节点'}</div>
						<h2>{selected.title}</h2>
						<p>{selected.summary}</p>
						<div className="path-role"><span>路径职责</span><strong>{selectedRole.role}</strong><p>{selectedRole.description}</p></div>
						{selected.url ? <a className="preview-link" href={selected.url}>进入节点详情 <span>→</span></a> : <p className="preview-unavailable">详情页待建立</p>}
					</>
				) : <div className="preview-empty"><strong>选择一个节点</strong></div>}
			</aside>
		</div>
	);
}

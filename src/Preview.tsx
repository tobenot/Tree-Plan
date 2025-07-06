import { useState, useEffect, useMemo, useRef, memo, forwardRef } from 'react';

type TiptapMark = {
	type: string;
	[key: string]: any;
};

type TiptapNode = {
	type: string;
	content?: TiptapNode[];
	text?: string;
	marks?: TiptapMark[];
};

type ThoughtRenderNode = {
	id: string;
	parentId: string | null;
	text: string;
	depth: number;
	isLinked: boolean;
	position: { x: number; y: number };
};


function parseTiptapNodes(rootNode: TiptapNode): ThoughtRenderNode[] {
	const renderNodes: ThoughtRenderNode[] = [];
	const depthWidth = 15; // 每个深度层级的宽度（百分比）
	const baseIndent = 5;  // 基础缩进

	function traverse(node: TiptapNode, parentId: string | null = null, depth = 0) {
		if (node.type === 'listItem' && node.content) {
			const id = `node-${renderNodes.length}`;
			let text = '';
			let isLinked = false;

			const paragraph = node.content.find(c => c.type === 'paragraph');
			if (paragraph?.content) {
				text = paragraph.content
					.filter(c => c.type === 'text')
					.map(c => c.text || '')
					.join('');
				
				isLinked = paragraph.content.some(c => 
					c.marks?.some(m => m.type === 'autoLink')
				);
			}

			if (text.trim()) {
				// 结构化布局
				const x = baseIndent + depth * depthWidth;
				const y = (renderNodes.length + 1) * 12; // 简单的垂直分布

				renderNodes.push({
					id,
					parentId,
					text,
					depth,
					isLinked,
					position: { x, y },
				});
				
				const nestedList = node.content.find(c => c.type === 'bulletList');
				if (nestedList?.content) {
					nestedList.content.forEach(childItem => {
						traverse(childItem, id, depth + 1);
					});
				}
			}
			return;
		}

		if (node.content) {
			node.content.forEach(child => traverse(child, parentId, depth));
		}
	}
    
	traverse(rootNode);
	return renderNodes;
}

type ThoughtNodeProps = {
	text: string;
	depth: number;
	position: {x: number; y: number};
	isLinked: boolean;
	isHighlighted: boolean;
	onMouseDown: (e: React.MouseEvent) => void;
	onClick: () => void;
};

// 思想节点组件
const ThoughtNode = memo(forwardRef<HTMLDivElement, ThoughtNodeProps>(({ text, depth, position, isLinked, isHighlighted, onMouseDown, onClick }, ref) => {
	// 调试信息，确认组件是否重新渲染
	console.log(`渲染节点: ${text}`);

	// 根据深度设置样式变体
	const baseClasses = "absolute p-leaf transform transition-all duration-300 rounded-leaf bg-white/90 shadow-sm cursor-pointer border-l-2 hover:-translate-y-1 hover:shadow-md max-w-xs";
	
	// 根据是否有链接添加不同的边框颜色
	const borderClass = isLinked ? "border-leaf-alt" : "border-branch-accent";

	const highlightClass = isHighlighted ? 'animate-[pulse-border_2s_ease-out]' : '';
	
	// 根据深度调整字体大小和透明度
	const depthClasses = [
		"text-leaf font-normal opacity-100 z-50",  // 深度 0
		"text-leaf font-normal opacity-95 z-40",   // 深度 1
		"text-root font-normal opacity-90 z-30",   // 深度 2
		"text-root font-normal opacity-85 z-20",   // 深度 3
		"text-root font-normal opacity-80 z-10",   // 深度 4
		"text-root font-light opacity-75 z-0",     // 深度 5
	][depth] || "text-root font-light opacity-70 z-0";
	
	return (
		<div 
			ref={ref}
			className={`${baseClasses} ${borderClass} ${depthClasses} ${highlightClass}`}
			style={{
				left: `${position.x}%`,
				top: `${position.y}%`
			}}
			onMouseDown={onMouseDown}
			onClick={onClick}
		>
			<div className="absolute top-1/2 left-0 w-2.5 h-2.5 bg-white border border-root-secondary/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
			{text}
		</div>
	);
}));

const Preview = ({ content }: { content: TiptapNode }) => {
	const [thoughtNodes, setThoughtNodes] = useState<ThoughtRenderNode[]>([]);
	const [draggingInfo, setDraggingInfo] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const nodeRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
	const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);

	useEffect(() => {
		if (!content) {
			setThoughtNodes([]);
			return;
		};
		
		const nodes = parseTiptapNodes(content);

		// 调试信息
		console.log('解析的节点:', nodes);
		setThoughtNodes(nodes);
	}, [content]);

	const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
		const nodeElement = e.currentTarget as HTMLDivElement;
		const rect = nodeElement.getBoundingClientRect();
		const offsetX = e.clientX - rect.left;
		const offsetY = e.clientY - rect.top;

		setDraggingInfo({ id: nodeId, offsetX, offsetY });
		e.preventDefault();
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!draggingInfo || !containerRef.current) return;

		const containerRect = containerRef.current.getBoundingClientRect();
		
		const newX = Math.max(0, Math.min(100, 
			((e.clientX - containerRect.left - draggingInfo.offsetX) / containerRect.width) * 100
		));
		const newY = Math.max(0, Math.min(100,
			((e.clientY - containerRect.top - draggingInfo.offsetY) / containerRect.height) * 100
		));

		setThoughtNodes(prevNodes =>
			prevNodes.map(n =>
				n.id === draggingInfo.id
					? { ...n, position: { ...n.position, x: newX, y: newY } }
					: n
			)
		);
		e.preventDefault();
	};

	const handleMouseUp = () => {
		setDraggingInfo(null);
	};
	
	const handleNodeClick = (nodeId: string) => {
		const clickedNode = thoughtNodes.find(n => n.id === nodeId);
		if (!clickedNode || !clickedNode.isLinked) return;

		const linkedPartner = thematicLinks.find(link => link.from.id === nodeId || link.to.id === nodeId);
		if (!linkedPartner) return;
		
		const targetNode = linkedPartner.from.id === nodeId ? linkedPartner.to : linkedPartner.from;
		const targetElement = nodeRefs.current.get(targetNode.id);

		if (targetElement) {
			targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
			
			setHighlightedNodeId(targetNode.id);
			setTimeout(() => {
				setHighlightedNodeId(null);
			}, 2000);
		}
	};
	
	// 使用 useMemo 优化关联链接的计算
	const thematicLinks = useMemo(() => {
		const links: Array<{from: ThoughtRenderNode, to: ThoughtRenderNode}> = [];
		const linkedGroups = thoughtNodes
			.filter(node => node.isLinked)
			.reduce((acc, node) => {
				acc[node.text] = acc[node.text] || [];
				acc[node.text].push(node);
				return acc;
			}, {} as Record<string, ThoughtRenderNode[]>);

		Object.values(linkedGroups).forEach(group => {
			if (group.length > 1) {
				for (let i = 0; i < group.length - 1; i++) {
					for (let j = i + 1; j < group.length; j++) {
						links.push({ from: group[i], to: group[j] });
					}
				}
			}
		});
		return links;
	}, [thoughtNodes]);

	// 调试信息
	console.log('思想节点数量:', thoughtNodes.length);
	console.log('思想节点:', thoughtNodes);
	
	// 渲染空状态
	if (!content || thoughtNodes.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[70vh] text-root-secondary">
				<p className="text-center p-trunk">思想森林尚未生长，请在编辑模式下播种想法。</p>
				<p className="text-center text-sm mt-2">调试信息: 内容存在={!!content}, 节点数量={thoughtNodes.length}</p>
			</div>
		);
	}
	
	return (
		<div className="relative w-full">
			{/* 顶部标题栏 */}
			<div className="sticky top-0 bg-earth-bg/80 backdrop-blur-sm w-full text-center py-twig z-50 border-b border-root-secondary/10">
				<span className="text-root text-root-secondary">预览模式：思想森林</span>
			</div>
			
			{/* 思想森林容器 */}
			<div 
				ref={containerRef}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				className="relative min-h-[120vh] w-full max-w-4xl mx-auto px-branch py-trunk bg-earth-bg/50 rounded-trunk overflow-hidden shadow-sm"
			>
				{/* 渲染所有连接线 */}
				<svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
					{/* 结构连接线 (灰色，实线) */}
					{thoughtNodes.map(node => {
						if (!node.parentId) return null;
						const parentNode = thoughtNodes.find(p => p.id === node.parentId);
						if (!parentNode) return null;
						const yOffset = 1.2;
		
						return (
							<line
								key={`line-struct-${node.id}-${parentNode.id}`}
								x1={`${parentNode.position.x}%`}
								y1={`${parentNode.position.y + yOffset}%`}
								x2={`${node.position.x}%`}
								y2={`${node.position.y + yOffset}%`}
								className="stroke-root-secondary/30"
								strokeWidth="1.5"
							/>
						);
					})}

					{/* 思想连接线 (主题色，虚线) */}
					{thematicLinks.map((link, index) => {
						const yOffset = 1.2;
						return (
						<line
							key={`line-theme-${index}`}
							x1={`${link.from.position.x}%`}
							y1={`${link.from.position.y + yOffset}%`}
							x2={`${link.to.position.x}%`}
							y2={`${link.to.position.y + yOffset}%`}
							className="stroke-branch-accent/50"
							strokeWidth="1.5"
							strokeDasharray="4 3"
						/>
					)})}
				</svg>

				{thoughtNodes.map((node) => (
					<ThoughtNode
						ref={(el) => {
							if (el) nodeRefs.current.set(node.id, el);
							else nodeRefs.current.delete(node.id);
						}}
						key={node.id}
						text={node.text}
						depth={node.depth}
						position={node.position}
						isLinked={node.isLinked}
						isHighlighted={node.id === highlightedNodeId}
						onMouseDown={(e) => handleMouseDown(e, node.id)}
						onClick={() => handleNodeClick(node.id)}
					/>
				))}
			</div>
			
			{/* 底部工具栏 */}
			<div className="sticky bottom-0 bg-earth-bg/80 backdrop-blur-sm w-full text-center py-twig mt-twig border-t border-root-secondary/10">
				<span className="text-root-secondary text-sm">可以拖动节点以调整布局</span>
			</div>
		</div>
	);
};

export default Preview; 
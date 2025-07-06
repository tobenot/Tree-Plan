import { useState, useEffect, useMemo } from 'react';

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

// 提取文本节点和链接状态（递归处理所有嵌套结构）
function extractTextNodesWithMeta(node: TiptapNode): Array<{text: string; isLinked: boolean}> {
	// 如果是文本节点，直接返回
	if (node.type === 'text') {
		const text = node.text || '';
		const isLinked = node.marks?.some(mark => mark.type === 'autoLink') || false;
		return [{text, isLinked}];
	}
	
	// 如果没有content，返回空数组
	if (!node.content) return [];
	
	// 递归处理所有子节点
	return node.content.flatMap(extractTextNodesWithMeta);
}

// 思想节点组件
const ThoughtNode = ({ text, depth, position, isLinked }: { 
	text: string;
	depth: number;
	position: {x: number; y: number};
	isLinked: boolean;
}) => {
	// 根据深度设置样式变体
	const baseClasses = "absolute p-leaf transform transition-all duration-300 rounded-leaf bg-white/90 shadow-sm cursor-pointer border-l-2 hover:-translate-y-1 hover:shadow-md max-w-xs";
	
	// 根据是否有链接添加不同的边框颜色
	const borderClass = isLinked ? "border-leaf-alt" : "border-branch-accent";
	
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
			className={`${baseClasses} ${borderClass} ${depthClasses}`}
			style={{
				left: `${position.x}%`,
				top: `${position.y}%`
			}}
		>
			{text}
		</div>
	);
};

const Preview = ({ content }: { content: TiptapNode }) => {
	// 使用useMemo优化提取和处理节点的过程
	const thoughtNodes = useMemo(() => {
		if (!content) return [];
		
		// 提取所有文本节点和它们的链接状态
		const extractedNodes = extractTextNodesWithMeta(content);
		
		// 调试信息
		console.log('提取的节点:', extractedNodes);
		
		// 过滤空节点并处理每个有效节点
		return extractedNodes
			.filter(item => item.text.trim().length > 0)
			.map((item, index) => {
				// 根据文本长度计算深度
				const length = item.text.length;
				const depth = Math.min(Math.floor(length / 10), 5); // 0-5深度级别
				
				// 随机但有约束的位置
				const x = 10 + Math.random() * 80; // 10-90% 宽度
				const y = 10 + Math.random() * 80; // 10-90% 高度
				
				return {
					id: index,
					text: item.text,
					depth,
					position: { x, y },
					isLinked: item.isLinked
				};
			});
	}, [content]);
	
	// 记录连接线的状态
	const [showConnections, setShowConnections] = useState(false);
	
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
			<div className="relative min-h-[70vh] w-full max-w-4xl mx-auto px-branch py-trunk bg-earth-bg/50 rounded-trunk overflow-hidden shadow-sm">
				{/* 渲染所有节点 */}
				{thoughtNodes.map((node) => (
					<ThoughtNode
						key={node.id}
						text={node.text}
						depth={node.depth}
						position={node.position}
						isLinked={node.isLinked}
					/>
				))}
				
				{/* 这里可以添加节点之间的连接线，使用SVG */}
				{showConnections && (
					<svg className="absolute inset-0 w-full h-full pointer-events-none">
						{/* 在这里可以动态生成SVG连接线 */}
						{/* 例如可以连接所有相同深度的节点，或者所有标记为链接的节点 */}
					</svg>
				)}
			</div>
			
			{/* 底部工具栏 */}
			<div className="sticky bottom-0 bg-earth-bg/80 backdrop-blur-sm w-full text-center py-twig mt-twig border-t border-root-secondary/10">
				<button 
					onClick={() => setShowConnections(!showConnections)}
					className="px-branch py-leaf text-root bg-branch-accent/10 hover:bg-branch-accent/20 text-branch-accent rounded-full transition-colors"
				>
					{showConnections ? "隐藏" : "显示"}思想连接
				</button>
			</div>
		</div>
	);
};

export default Preview; 
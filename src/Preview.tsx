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

// 节点尺寸类型
type NodeSize = {
	width: number;
	height: number;
};


function parseTiptapNodes(rootNode: TiptapNode): ThoughtRenderNode[] {
	const renderNodes: ThoughtRenderNode[] = [];
	const depthWidth = 350; // 每个深度层级的宽度 (像素)
	const baseIndent = 50;  // 基础缩进
	const verticalSpacing = 100; // 垂直间距

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
				// 结构化布局 - 使用像素单位
				const x = baseIndent + depth * depthWidth;
				const y = (renderNodes.length + 1) * verticalSpacing;

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
	isDimmed: boolean;
	onMouseDown: (e: React.MouseEvent) => void;
	onClick: () => void;
	onContextMenu: (e: React.MouseEvent) => void;
};

// 思想节点组件
const ThoughtNode = memo(forwardRef<HTMLDivElement, ThoughtNodeProps>(({ text, depth, position, isLinked, isHighlighted, isDimmed, onMouseDown, onClick, onContextMenu }, ref) => {
	// 调试信息，确认组件是否重新渲染
	console.log(`渲染节点: ${text}`);

	// 根据深度设置样式变体
	const baseClasses = "absolute p-leaf transform rounded-leaf bg-white/90 shadow-sm cursor-pointer border-l-2 hover:-translate-y-1 hover:shadow-md w-64 transition-all duration-300 select-none";
	
	// 根据是否有链接添加不同的边框颜色
	const borderClass = isLinked ? "border-leaf-alt" : "border-branch-accent";

	const highlightClass = isHighlighted ? 'animate-[pulse-border_2s_ease-out] z-20' : 'z-10';
	const dimClass = isDimmed ? 'opacity-20 blur-sm' : 'opacity-100';
	
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
			className={`${baseClasses} ${borderClass} ${depthClasses} ${highlightClass} ${dimClass}`}
			style={{
				transform: `translate(${position.x}px, ${position.y}px)`
			}}
			onMouseDown={onMouseDown}
			onClick={onClick}
			onContextMenu={onContextMenu}
			onCopy={(e) => {
				e.preventDefault();
				e.stopPropagation();
				return false;
			}}
		>
			<div className="absolute top-1/2 left-0 w-2.5 h-2.5 bg-white border border-root-secondary/50 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
			{text}
		</div>
	);
}));

const Preview = ({ content }: { content: TiptapNode }) => {
	const [thoughtNodes, setThoughtNodes] = useState<ThoughtRenderNode[]>([]);
	const [draggingInfo, setDraggingInfo] = useState<{ id: string; startX: number; startY: number; } | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [focusedText, setFocusedText] = useState<string | null>(null);
	const [transform, setTransform] = useState({ scale: 0.8, x: 100, y: 100 });
	const [isPanning, setIsPanning] = useState(false);
	const panStart = useRef({ x: 0, y: 0 });
	const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: ThoughtRenderNode } | null>(null);

	// 禁用复制功能
	const handleCopy = (e: React.ClipboardEvent) => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	// 禁用右键菜单（除了我们自定义的）
	const handleContextMenuGlobal = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		return false;
	};

	// 动态节点尺寸管理
	const nodeSizes = useRef(new Map<string, NodeSize>());
	const [forceUpdate, setForceUpdate] = useState(0);

	const handleNodeRef = (nodeId: string) => (el: HTMLDivElement | null) => {
		if (el) {
			const newSize = {
				width: el.offsetWidth,
				height: el.offsetHeight
			};
			const oldSize = nodeSizes.current.get(nodeId);
			
			// 只有当尺寸真正改变时才触发更新
			if (!oldSize || oldSize.width !== newSize.width || oldSize.height !== newSize.height) {
				nodeSizes.current.set(nodeId, newSize);
				// 强制重新渲染连接线
				setForceUpdate(prev => prev + 1);
			}
		}
	};

	// 修复滚轮缩放 - 使用更简单直接的方式
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			e.stopPropagation();
			
			const scaleAmount = -e.deltaY * 0.001;
			const newScale = Math.min(Math.max(0.1, transform.scale + scaleAmount), 2);
			
			const rect = container.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			const newX = transform.x + (mouseX - transform.x) * (1 - newScale / transform.scale);
			const newY = transform.y + (mouseY - transform.y) * (1 - newScale / transform.scale);
			
			setTransform({ scale: newScale, x: newX, y: newY });
		};
		
		container.addEventListener('wheel', handleWheel, { passive: false });

		return () => {
			container.removeEventListener('wheel', handleWheel);
		};
	}, [transform]); // 依赖于 transform

	useEffect(() => {
		if (!content) {
			setThoughtNodes([]);
			return;
		};
		
		const nodes = parseTiptapNodes(content);

		// 调试信息
		console.log('解析的节点:', nodes);
		setThoughtNodes(nodes);
		
		// 延迟强制刷新，确保所有节点都已渲染并获取到尺寸
		const timer = setTimeout(() => {
			setForceUpdate(prev => prev + 1);
		}, 100);
		
		return () => clearTimeout(timer);
	}, [content]);

	const handleNodeMouseDown = (e: React.MouseEvent, node: ThoughtRenderNode) => {
		e.stopPropagation();
		setDraggingInfo({
			id: node.id,
			startX: e.clientX / transform.scale - node.position.x,
			startY: e.clientY / transform.scale - node.position.y,
		});
	};

	const handleContainerMouseDown = (e: React.MouseEvent) => {
		closeContextMenu();
		// 点击背景时取消聚焦, 或开始平移
		if (e.target === containerRef.current) {
			setFocusedText(null);
			setIsPanning(true);
			panStart.current = {
				x: e.clientX - transform.x,
				y: e.clientY - transform.y,
			};
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (isPanning) {
			const x = e.clientX - panStart.current.x;
			const y = e.clientY - panStart.current.y;
			setTransform(t => ({ ...t, x, y }));
			return;
		}

		if (draggingInfo) {
			const newX = e.clientX / transform.scale - draggingInfo.startX;
			const newY = e.clientY / transform.scale - draggingInfo.startY;

			setThoughtNodes(nodes =>
				nodes.map(n =>
					n.id === draggingInfo.id
						? { ...n, position: { x: newX, y: newY } }
						: n
				)
			);
		}
	};

	const handleMouseUp = () => {
		setIsPanning(false);
		setDraggingInfo(null);
	};

	const handleContextMenu = (e: React.MouseEvent, node: ThoughtRenderNode) => {
		e.preventDefault();
		e.stopPropagation();
		
		// 获取准确的鼠标位置，相对于视口
		const rect = containerRef.current?.getBoundingClientRect();
		if (!rect) return;
		
		setContextMenu({
			x: e.clientX,
			y: e.clientY,
			node: node,
		});
	};

	const closeContextMenu = () => {
		setContextMenu(null);
	};

	// 改进的复制功能 - 支持更多浏览器
	const copyNodeText = async (content: string) => {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			try {
				await navigator.clipboard.writeText(content);
				console.log('复制成功');
			} catch (err) {
				fallbackCopy(content);
			}
		} else {
			fallbackCopy(content);
		}
		closeContextMenu();
	};

	const fallbackCopy = (content: string) => {
		const textarea = document.createElement('textarea');
		textarea.value = content;
		textarea.style.position = 'fixed';
		textarea.style.top = '-9999px';
		textarea.style.left = '-9999px';
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();
		try {
			const successful = document.execCommand('copy');
			if (successful) {
				console.log('复制成功');
			} else {
				console.log('复制失败');
			}
		} catch (error) {
			console.log('复制失败');
		}
		document.body.removeChild(textarea);
	};

	const handleNodeClick = (clickedNode: ThoughtRenderNode) => {
		if (!clickedNode.isLinked) return;
		
		// 如果点击的已经是高亮的节点，则取消聚焦
		if (focusedText && clickedNode.text === focusedText) {
			setFocusedText(null);
		} else {
			// 否则，聚焦到这个节点的文本
			setFocusedText(clickedNode.text);
		}
	};

	const resetView = () => {
		setTransform({ scale: 0.8, x: 100, y: 100 });
		setFocusedText(null);
	};

	const zoom = (direction: 'in' | 'out') => {
		const scaleAmount = direction === 'in' ? 0.2 : -0.2;
		const newScale = Math.min(Math.max(0.1, transform.scale + scaleAmount), 2);
		setTransform(t => ({ ...t, scale: newScale }));
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
	}, [thoughtNodes, forceUpdate]);

	// 调试信息
	console.log('思想节点数量:', thoughtNodes.length);
	console.log('思想节点:', thoughtNodes);
	
	// 渲染空状态
	if (!content || thoughtNodes.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[70vh] text-root-secondary">
				<p className="text-center p-trunk">思想森林尚未生长，请在编辑模式下播种想法。</p>
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="relative h-full w-full overflow-hidden bg-earth-bg cursor-grab active:cursor-grabbing"
			onMouseDown={handleContainerMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp} // End panning if mouse leaves
			onCopy={handleCopy}
			onContextMenu={handleContextMenuGlobal}
		>
			<div
				className="absolute top-0 left-0"
				style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`, transformOrigin: 'top left' }}
			>
				{/* SVG should be large enough, or dynamically sized. For now, a large static size. */}
				<svg className="absolute top-0 left-0 pointer-events-none z-0 overflow-visible">
					{/* 结构连接线 */}
					{thoughtNodes.map(node => {
						if (!node.parentId) return null;
						const parentNode = thoughtNodes.find(p => p.id === node.parentId);
						if (!parentNode) return null;
						const isDimmed = focusedText && ![node.text, parentNode.text].includes(focusedText);

						// 动态获取节点宽高，若未获取到则用默认值
						const parentSize = nodeSizes.current.get(parentNode.id) || {width: 200, height: 48};
						const nodeSize = nodeSizes.current.get(node.id) || {width: 200, height: 48};

						// 起点：父节点中心下方
						const startX = parentNode.position.x + parentSize.width / 2;
						const startY = parentNode.position.y + parentSize.height;
						// 终点：子节点左侧中心
						const endX = node.position.x;
						const endY = node.position.y + nodeSize.height / 2;
						const cornerRadius = 10;

            // 判断子节点是否在父节点上方（用连接点而不是节点顶点）
            const isChildAbove = endY < startY;

            let pathData = `M ${startX} ${startY}`;
            if (Math.abs(endY - startY) > cornerRadius) {
              if (isChildAbove) {
                // 子节点在上方：向上弯曲
                pathData += ` L ${startX} ${endY + cornerRadius}`;
                pathData += ` Q ${startX} ${endY} ${startX + cornerRadius} ${endY}`;
              } else {
                // 子节点在下方：向下弯曲
                pathData += ` L ${startX} ${endY - cornerRadius}`;
                pathData += ` Q ${startX} ${endY} ${startX + cornerRadius} ${endY}`;
              }
            } else {
              // 距离很近，直接圆角
              pathData += ` Q ${startX} ${endY} ${startX + cornerRadius} ${endY}`;
            }
            pathData += ` L ${endX} ${endY}`;

						return (
							<path
								key={`line-struct-${node.id}-${parentNode.id}`}
								d={pathData}
								className={`stroke-root-secondary/40 transition-opacity duration-300 ${isDimmed ? 'opacity-10' : 'opacity-100'}`}
								strokeWidth={1.8 / transform.scale}
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								filter="drop-shadow(0 1px 1px rgba(0,0,0,0.1))"
							/>
						);
					})}

					{/* 思想连接线 */}
					{thematicLinks.map((link, index) => {
						const isDimmed = focusedText && ![link.from.text, link.to.text].includes(focusedText);
						const isHighlighted = focusedText && link.from.text === focusedText;

						// 动态获取节点宽高，若未获取到则用默认值
						const fromSize = nodeSizes.current.get(link.from.id) || {width: 200, height: 48};
						const toSize = nodeSizes.current.get(link.to.id) || {width: 200, height: 48};

						// 起点：源节点右侧中心
						const startX = link.from.position.x + fromSize.width;
						const startY = link.from.position.y + fromSize.height / 2;
						// 终点：目标节点左侧中心
						const endX = link.to.position.x;
						const endY = link.to.position.y + toSize.height / 2;
						
						// 智能计算路径：根据节点位置关系选择最佳路径
						const cornerRadius = 8; // 圆角半径
						let pathData: string;
						
						// 如果两个节点距离较近，使用简单的直线连接
						const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
						if (distance < 100) {
							pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
						} else {
							// 否则使用90度弯折路径
							const verticalEndY = startY + 25; // 垂直段长度
							const horizontalY = Math.max(verticalEndY, endY - 10); // 水平段位置
							
							// 使用更平滑的路径，避免过于尖锐的拐角
							pathData = `M ${startX} ${startY} 
								L ${startX} ${horizontalY - cornerRadius} 
								Q ${startX} ${horizontalY} ${startX + cornerRadius} ${horizontalY} 
								L ${endX - cornerRadius} ${horizontalY} 
								Q ${endX} ${horizontalY} ${endX} ${horizontalY + cornerRadius} 
								L ${endX} ${endY}`;
						}

						return (
							<path
								key={`line-theme-${index}`}
								d={pathData}
								className={`stroke-branch-accent/60 transition-all duration-300 ${isDimmed ? 'opacity-0' : 'opacity-100'} ${isHighlighted ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}
								strokeWidth={(isHighlighted ? 2.5 : 1.5) / transform.scale}
								strokeDasharray="4 3"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
								filter="drop-shadow(0 1px 1px rgba(0,0,0,0.15))"
							/>
						)
					})}
				</svg>

				{thoughtNodes.map((node) => {
					const isHighlighted = focusedText === node.text;
					const isDimmed = focusedText !== null && focusedText !== node.text;

					return (
						<ThoughtNode
							ref={handleNodeRef(node.id)}
							key={node.id}
							text={node.text}
							depth={node.depth}
							position={node.position}
							isLinked={node.isLinked}
							isHighlighted={isHighlighted}
							isDimmed={isDimmed}
							onMouseDown={(e) => handleNodeMouseDown(e, node)}
							onClick={() => handleNodeClick(node)}
							onContextMenu={(e) => handleContextMenu(e, node)}
						/>
					)
				})}
			</div>
			
			<div className="absolute bottom-branch left-branch z-10 flex items-center space-x-2">
				<button onClick={() => zoom('out')} className="control-button">-</button>
				<button onClick={resetView} className="control-button text-sm">{Math.round(transform.scale * 100)}%</button>
				<button onClick={() => zoom('in')} className="control-button">+</button>
			</div>
			
			{contextMenu && (
				<div
					style={{ 
						position: 'fixed',
						top: contextMenu.y, 
						left: contextMenu.x,
						zIndex: 9999
					}}
					className="w-48 bg-white/95 backdrop-blur-sm rounded-md shadow-lg border border-root-secondary/20 text-sm animate-grow"
				>
					<ul className="py-1">
						<li>
							<button
								onClick={() => copyNodeText(contextMenu.node.text)}
								className="w-full text-left px-4 py-2 text-bark-text hover:bg-moss-subtle flex items-center space-x-2"
							>
								<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
								<span>复制文本</span>
							</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
};

export default Preview; 
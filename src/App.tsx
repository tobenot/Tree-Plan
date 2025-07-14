import { useState, useEffect } from 'react';
import Editor from './Editor';
import Preview from './Preview';
import initialNotes from './data/notes.json'; // Load initial data

const ContactWidget = () => {
	const [isOpen, setIsOpen] = useState(false);
	const mailToSubject = encodeURIComponent("关于「树计划」的一些想法");
	const mailToBody = encodeURIComponent("你好，我在「树计划」里看到了关于 [请在此填写主题] 的内容，我想问/聊聊 [请在此填写你的问题或想法]...");
	const mailToLink = `mailto:tobenot@qq.com?subject=${mailToSubject}&body=${mailToBody}`;

	return (
		<div className="fixed bottom-branch right-branch z-50">
			<div className={`transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
				<div className="absolute bottom-full right-0 mb-leaf w-72 p-branch bg-earth-bg/90 backdrop-blur-sm rounded-branch shadow-lg border border-root-secondary/20 text-sm text-left">
					<p className="italic text-root-secondary">"对共同话题的渴望也是共同话题。"</p>
					<h3 className="font-bold text-branch-accent mt-twig">找到共鸣了？对哪个点感兴趣？</h3>
					<p className="mt-sprout text-bark-text">欢迎随时通过各种方式联系我。一个问题是最好的起点。</p>
					<a href={mailToLink} className="mt-twig inline-block bg-branch-accent text-white px-twig py-leaf rounded-leaf hover:bg-leaf-alt transition-colors shadow-sm text-xs font-semibold">
						用“我在树计划里看到了...”发起对话
					</a>
					<div className="flex space-x-leaf mt-twig text-xs text-root-secondary">
						<span>由 tobenot 创建 |</span>
						<a href="https://tobenot.top" className="hover:text-branch-accent transition-colors">Blog</a>
						<a href="https://github.com/tobenot" className="hover:text-branch-accent transition-colors">GitHub</a>
						<a href="https://www.flaticon.com/free-icons/plant" title="plant icons">Icon</a>
					</div>
				</div>
			</div>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-14 h-14 bg-branch-accent text-white rounded-full flex items-center justify-center shadow-lg hover:bg-leaf-alt transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-earth-bg focus-visible:ring-branch-accent"
				aria-label={isOpen ? '关闭联系方式' : '打开联系方式'}
			>
				<svg xmlns="http://www.w3.org/2000/svg" className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
					{isOpen ? <line x1="18" y1="6" x2="6" y2="18"></line> : <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>}
					{isOpen && <line x1="6" y1="6" x2="18" y2="18"></line>}
				</svg>
			</button>
		</div>
	);
};


function App() {
	const [viewMode, setViewMode] = useState(import.meta.env.PROD ? 'preview' : 'edit');
	const [noteContent, setNoteContent] = useState(initialNotes);
	const isPreview = viewMode === 'preview';

	// 添加全局控制台命令
	useEffect(() => {
		(window as any).toggleEditMode = () => {
			setViewMode(isPreview ? 'edit' : 'preview');
			console.log(`已切换到${isPreview ? '编辑' : '预览'}模式`);
		};
		
		(window as any).setEditMode = (mode: 'edit' | 'preview') => {
			setViewMode(mode);
			console.log(`已切换到${mode === 'edit' ? '编辑' : '预览'}模式`);
		};
		
		console.log('🌳 树计划控制台命令已加载:');
		console.log('  toggleEditMode() - 切换编辑/预览模式');
		console.log('  setEditMode("edit") - 设置为编辑模式');
		console.log('  setEditMode("preview") - 设置为预览模式');
	}, [isPreview]);

	return (
		<div className="h-screen w-screen flex flex-col bg-earth-bg antialiased">
			<header className="py-twig px-branch text-center relative z-20 bg-earth-bg/60 backdrop-blur-sm border-b border-root-secondary/10 shrink-0">
				<h1 className="font-display text-branch text-bark-text font-bold tracking-[-0.02em] select-none">
					🌳 树计划
				</h1>
				
				{import.meta.env.DEV && (
					<div className="absolute top-1/2 -translate-y-1/2 left-branch">
						<button
							onClick={() => setViewMode(isPreview ? 'edit' : 'preview')}
							className="bg-moss-subtle text-bark-text px-twig py-leaf rounded-leaf font-medium text-root shadow-sm hover:shadow-md transition-all duration-200 hover:bg-root-secondary/20 border-2 border-transparent hover:border-root-secondary/30 text-sm"
						>
							{isPreview ? '✏️ 编辑' : '👁️‍🗨️ 预览'}
						</button>
					</div>
				)}
			</header>

			<main className="flex-grow relative overflow-hidden">
				{isPreview
					? <Preview content={noteContent} />
					: <div className="h-full w-full overflow-y-auto"><Editor content={noteContent} onUpdate={setNoteContent} /></div>
				}
			</main>

			{isPreview && <ContactWidget />}
		</div>
	);
}

export default App;

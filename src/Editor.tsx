import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AutoLink } from './extensions/AutoLink';
import notesData from './data/notes.json';

const TiptapEditor = () => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			AutoLink,
		],
		content: notesData,
		editorProps: {
			attributes: {
				class: 'prose max-w-none forest-paper organic-shape border-2 border-root-secondary/30 p-branch min-h-96 focus:outline-none focus:ring-2 focus:ring-branch-accent/30 focus:border-branch-accent/50 transition-all duration-200 shadow-sm',
			},
		},
	});

	const exportNotes = () => {
		if (editor) {
			const json = editor.getJSON();
			// 方案一：在控制台打印，方便复制
			console.log(JSON.stringify(json, null, 2));
			alert('笔记JSON已打印到控制台，请手动复制并覆盖 notes.json 文件！');

			// 方案二：下载文件
			// const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
			// const url = URL.createObjectURL(blob);
			// const a = document.createElement('a');
			// a.href = url;
			// a.download = 'notes.json';
			// a.click();
			// URL.revokeObjectURL(url);
		}
	}

	return (
		<div className="space-y-twig grow-in">
			<button 
				onClick={exportNotes} 
				className="bg-branch-accent text-white px-twig py-leaf organic-shape font-medium text-root shadow-sm hover:shadow-md transition-all duration-200 hover:bg-leaf-alt border-2 border-branch-accent/20 hover:-translate-y-0.5"
			>
				📝 导出笔记到文件
			</button>
			<EditorContent editor={editor} />
		</div>
	);
};

export default TiptapEditor; 
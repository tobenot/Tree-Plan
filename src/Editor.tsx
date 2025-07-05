import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { AutoLink } from './extensions/AutoLink';
// We no longer import the static data here

type TiptapEditorProps = {
	content: any; // Tiptap content can be complex, 'any' is suitable here for flexibility
	onUpdate: (content: any) => void;
};

const TiptapEditor = ({ content, onUpdate }: TiptapEditorProps) => {
	const editor = useEditor({
		extensions: [
			StarterKit,
			AutoLink,
		],
		content: content, // Use content from props
		editorProps: {
			attributes: {
				class: 'prose max-w-none forest-paper organic-shape border-2 border-root-secondary/30 p-branch min-h-96 focus:outline-none focus:ring-2 focus:ring-branch-accent/30 focus:border-branch-accent/50 transition-all duration-200 shadow-sm',
			},
		},
		onUpdate: ({ editor }) => {
			onUpdate(editor.getJSON());
		},
	});

	const exportNotes = () => {
		if (editor) {
			const json = editor.getJSON();
			const jsonString = JSON.stringify(json, null, 2);
			
			navigator.clipboard.writeText(jsonString).then(() => {
				alert('笔记的JSON内容已成功复制到剪贴板！');
			}).catch(err => {
				console.error('无法复制到剪贴板: ', err);
				alert('复制失败，请检查浏览器权限或手动从控制台复制。');
				console.log(jsonString); // Fallback for user to copy manually
			});
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
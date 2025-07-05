import { useState } from 'react';
import Editor from './Editor';
import Preview from './Preview';
import initialNotes from './data/notes.json'; // Load initial data

function App() {
	const [isPreview, setIsPreview] = useState(false);
	const [noteContent, setNoteContent] = useState(initialNotes);

	return (
		<div className="max-w-4xl mx-auto px-branch py-trunk">
			<h1 className="font-display text-trunk text-bark-text font-bold text-center mb-trunk tracking-[-0.02em]">
				🌳 思想森林
			</h1>
			<div className="flex justify-center mb-branch">
				<button 
					onClick={() => setIsPreview(!isPreview)}
					className="bg-moss-subtle text-bark-text px-twig py-leaf organic-shape font-medium text-root shadow-sm hover:shadow-md transition-all duration-200 hover:bg-root-secondary/20 border-2 border-transparent hover:border-root-secondary/30"
				>
					{isPreview ? '✏️ 返回编辑' : '👁️‍🗨️ 本地预览'}
				</button>
			</div>
			{isPreview 
				? <Preview content={noteContent} /> 
				: <Editor content={noteContent} onUpdate={setNoteContent} />
			}
		</div>
	);
}

export default App;

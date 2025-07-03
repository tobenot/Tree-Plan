import Editor from './Editor';

function App() {
	return (
		<div className="max-w-4xl mx-auto px-branch py-trunk">
			<h1 className="font-display text-trunk text-bark-text font-bold text-center mb-trunk tracking-[-0.02em]">
				🌳 思想森林
			</h1>
			<p className="text-root text-root-secondary text-center mb-branch">
				在这里播种想法，培育思考，与志同道合的人连接
			</p>
			<Editor />
		</div>
	);
}

export default App;

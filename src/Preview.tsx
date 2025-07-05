// import notesData from './data/notes.json'; // No longer needed

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

// Helper to get text from a Tiptap node
function getNodeText(node: TiptapNode): string {
  if (!node.content) return '';
  return node.content.map(getNodeText).join('');
}

// Recursive component to render Tiptap nodes
function RenderNode({ node }: { node: TiptapNode }) {
  if (node.type === 'text') {
    const textContent = node.text || '';
    if (node.marks?.some((mark: TiptapMark) => mark.type === 'autoLink')) {
      // It's a link, render with special style
      return (
        <span className="text-leaf-alt font-semibold branch-underline cursor-help" title={`Linked to: ${textContent}`}>
          {textContent}
        </span>
      );
    }
    return textContent;
  }

  const children = node.content ? node.content.map((child: TiptapNode, index: number) => <RenderNode key={index} node={child} />) : null;

  switch (node.type) {
    case 'doc':
      return <div className="prose max-w-none">{children}</div>;
    case 'bulletList':
      return <ul>{children}</ul>;
    case 'listItem':
      return <li>{children}</li>;
    case 'paragraph':
      return <p>{children}</p>;
    default:
      return null;
  }
}

const Preview = ({ content }: { content: TiptapNode }) => {
  if (!content) {
    return (
      <div className="forest-paper organic-shape border-2 border-root-secondary/30 p-branch text-root-secondary">
        <p>笔记内容为空，请在编辑模式下输入内容。</p>
      </div>
    );
  }
  return (
    <div className="forest-paper organic-shape border-2 border-root-secondary/30 p-branch">
      <RenderNode node={content} />
    </div>
  );
};

export default Preview; 
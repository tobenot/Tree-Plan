const fs = require('fs');
const path = require('path');

const NOTES_PATH = path.join(__dirname, '../src/data/notes.json');

// Helper to get the full text content of a paragraph node
function getParagraphText(pNode) {
  if (pNode.type !== 'paragraph' || !pNode.content) {
    return null;
  }
  return pNode.content.map(textNode => textNode.text || '').join('');
}

// Recursive function to traverse the Tiptap document tree
function traverse(node, callback) {
  if (!node) return;
  callback(node);
  if (node.content && Array.isArray(node.content)) {
    node.content.forEach(child => traverse(child, callback));
  }
}

function run() {
  console.log('🔗 Starting link generation...');

  const rawData = fs.readFileSync(NOTES_PATH, 'utf-8');
  const doc = JSON.parse(rawData);

  // Pass 1: Collect all text from list items
  const textCounts = new Map();
  traverse(doc, (node) => {
    if (node.type === 'listItem') {
      const pNode = node.content?.find(child => child.type === 'paragraph');
      if (pNode) {
        const text = getParagraphText(pNode);
        if (text) {
          textCounts.set(text, (textCounts.get(text) || 0) + 1);
        }
      }
    }
  });

  // Filter for texts that appear more than once
  const linkableTexts = new Set();
  for (const [text, count] of textCounts.entries()) {
    if (count > 1) {
      linkableTexts.add(text);
    }
  }

  if (linkableTexts.size === 0) {
    console.log('✅ No new links to generate.');
    return;
  }
  console.log(`🔍 Found ${linkableTexts.size} sets of linkable notes:`, linkableTexts);


  // Pass 2: Apply 'autoLink' mark to the relevant text nodes
  traverse(doc, (node) => {
    if (node.type === 'listItem') {
        const pNode = node.content?.find(child => child.type === 'paragraph');
        if (pNode) {
            const text = getParagraphText(pNode);
            if (linkableTexts.has(text)) {
                // Apply the mark to all text fragments inside the paragraph
                if (pNode.content) {
                    pNode.content.forEach(textNode => {
                        if(textNode.type === 'text') {
                            // Ensure marks array exists and add our mark
                            const existingMarks = textNode.marks?.filter(m => m.type !== 'autoLink') || [];
                            textNode.marks = [
                                ...existingMarks, 
                                { type: 'autoLink', attrs: { 'data-link-key': text } }
                            ];
                        }
                    });
                }
            }
        }
    }
  });

  // Write the updated JSON back to the file
  fs.writeFileSync(NOTES_PATH, JSON.stringify(doc, null, 2));
  console.log('✅ Successfully updated notes.json with new links!');
}

run(); 


figma.showUI(__html__);
figma.ui.resize(500, 300);
figma.ui.onmessage = async msg => {
  if (msg.type === 'create-palette') {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < msg.count; i++) {
      const rect = figma.createRectangle();
      rect.x = 100 * i;
      rect.fills = [{ type: 'SOLID', color: { r: Math.random(), g: Math.random(), b:  Math.random()} }];
      // const colorJson = JSON.stringify(rect.fills);
      // console.log(`${colorJson}`);
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  }

  if (msg.type === 'cancel') {
    figma.closePlugin();
  }
  
  if (msg.type === 'increase-font-size') {
    await processAllTextNodes(node => {
      (node as TextNode).fontSize += 1;
    });
  }

  if (msg.type === 'decrease-font-size') {
    await processAllTextNodes(node => {
      (node as TextNode).fontSize -= 1;
    });
  }
  
};

async function processAllTextNodes(callback: (node: SceneNode) => void): Promise<void> {
  const allTextNodes: SceneNode[] = [];

  function traverse(node: BaseNode) {
    if ('type' in node) {
      if (node.type === 'TEXT') {
        allTextNodes.push(node);
      } else if ('children' in node) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    }
  }
  for (const page of figma.root.children) {
    traverse(page);
  }

  const fontPromises: Promise<void>[] = allTextNodes.map(node => figma.loadFontAsync(node.fontName as FontName));

  await Promise.all(fontPromises);

  for (const node of allTextNodes) {
    callback(node);
  }
}
function randomColor(): string {
  throw new Error("Function not implemented.");
}


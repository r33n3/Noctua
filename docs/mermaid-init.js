import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#6b4c1e',
    primaryTextColor: '#e8dcc8',
    primaryBorderColor: '#d4a017',
    lineColor: '#9a8e7a',
    secondaryColor: '#1a1f30',
    tertiaryColor: '#0f1525',
    background: '#0f1525',
    mainBkg: '#6b4c1e',
    nodeBorder: '#d4a017',
    clusterBkg: '#0b0f19',
    clusterBorder: '#2a3045',
    titleColor: '#d4a017',
    edgeLabelBackground: '#0f1525',
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif'
  },
  flowchart: { curve: 'basis', padding: 15 },
  securityLevel: 'loose'
});

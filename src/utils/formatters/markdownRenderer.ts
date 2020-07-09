const marked = require('marked');
const TerminalRenderer = require('marked-terminal');

marked.setOptions({
    renderer: new TerminalRenderer({ listitem: (body: any) => body }),
    mangle: false
});

export class MarkdownRenderer {
    public static render(text: string): string {
        return marked(text);
    }
}

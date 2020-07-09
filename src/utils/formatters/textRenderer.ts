import { HtmlRenderer } from "./htmlRenderer";
import { MarkdownRenderer } from "./markdownRenderer";

export class TextRenderer {
    public static render(text: string): string {
        if (HtmlRenderer.containsHtml(text)) {
            text = HtmlRenderer.render(text);
        } else {
            text = MarkdownRenderer.render(text);
        }

        // remove large chunks of whitespace
        while (text.match(/\n\n\n/gm)) {
            text = text.replace(/\n\n\n/gm, '\n\n');
        }

        // only trim right to not interfere with indentations (whole text might be indented)
        return text.trimRight();
    }
}

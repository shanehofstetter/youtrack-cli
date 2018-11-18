const htmlToText = require('html-to-text');

export class HtmlRenderer {

    // html content is wrapped inside special tags
    // example: {html class=lorem}<html>ipsum</html>{html}
    private static htmlRegex = /{html[a-zA-Z=\s]*}([\s\S]*?){html[a-zA-Z=\s]*}/mi;

    public static render(text: string): string {
        const htmlContentMatch = text.match(HtmlRenderer.htmlRegex);
        if (htmlContentMatch && htmlContentMatch.length > 0) {
            text = text.replace(new RegExp(HtmlRenderer.htmlRegex, 'gmi'), htmlToText.fromString(htmlContentMatch[1], {
                ignoreImage: true,
                ignoreHref: true,
                tables: true,
                wordwrap: 120
            }));
        }

        // remove {cut} tags (unsure what the semantic is there)
        return text.replace(/{cut[\s>]*}/gmi, '');
    }

    public static containsHtml(text: string): boolean {
        return !!text.match(HtmlRenderer.htmlRegex);
    }
}

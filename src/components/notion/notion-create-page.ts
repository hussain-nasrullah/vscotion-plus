import { CreatePageResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionSupportedLanguages } from "./types/notion-supported-languages";
import { purifyLanguageType } from "../../utilities/purify-language-type";

export const AppendToNotionSnippetPage = async (
  notionInstance: any,
  pageId: string,
  content: string,
  codeContent: string,
  codeLanguage: NotionSupportedLanguages,
  caption: string
): Promise<CreatePageResponse> => {
  const snippetPage = await notionInstance.blocks.children.append({
    block_id: pageId,
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content: content,
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "code",
        code: {
          caption: [
            {
              type: "text",
              text: {
                content: caption,
                link: null,
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: "default",
              },
              plain_text: caption,
              href: null,
            },
          ],
          rich_text: [
            {
              type: "text",
              text: {
                content: codeContent,
              },
            },
          ],
          language: purifyLanguageType(codeLanguage),
        },
      },
    ],
  });
  return snippetPage;
};

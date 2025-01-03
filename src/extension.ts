import { PostPage } from "./components/notion/types/notion-submit-page-request";
import {
  VsCodeSetInputBox,
  GetVScodeFileContent,
} from "./components/vscode-elements";
import {
  SetNotionParentPage,
  Auth,
  AppendToNotionSnippetPage,
} from "./components/notion";
import { Client } from "@notionhq/client";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  Auth.init(context);
  const notionIntegration = Auth.instance;

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscotionPlus.addIntegrationKey",
      async () => {
        const notionIntegrationKey: string | undefined =
          await notionIntegration.getNotionToken();
        const userIntegrationKeyInput = await VsCodeSetInputBox(
          "Enter Your Integration Key",
          notionIntegrationKey
        );
        if (userIntegrationKeyInput) {
          await notionIntegration.storeNotionToken(userIntegrationKeyInput);
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscotionPlus.showCurrentIntegrationKey",
      async (): Promise<string | undefined> => {
        const notionIntegrationKey: string | undefined =
          await notionIntegration.getNotionToken();
        vscode.window.showInformationMessage(`${notionIntegrationKey}`);
        return notionIntegrationKey;
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vscotionPlus.scanDocument", () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        return {
          code: editor.document.getText(),
          language: editor.document.languageId,
        };
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "vscotionPlus.prepareNotionRequest",
      async (): Promise<PostPage> => {
        const notionIntegrationKey: string | undefined =
          await notionIntegration.getNotionToken();
        const notion = new Client({ auth: notionIntegrationKey });
        const parentPageId = (await SetNotionParentPage(notion)) ?? "";

        const pageTitle =
          (await vscode.window.showInputBox({
            title: "Please type your snippet title",
            value: "My awesome snippet",
          })) ?? "";

        const snippet: any = GetVScodeFileContent();

        return {
          id: parentPageId,
          title: pageTitle,
          code: snippet.code,
          language: snippet.language,
          caption: snippet.file,
        };
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("vscotionPlus.saveToNotion", async () => {
      const notionIntegrationKey: string | undefined =
        await notionIntegration.getNotionToken();
      const notion = new Client({ auth: notionIntegrationKey });
      if (!!notionIntegrationKey) {
        //@ts-ignore-nextline
        vscode.commands
          .executeCommand("vscotionPlus.prepareNotionRequest")
          .then(
            (request: any): PostPage =>
              //@ts-ignore-nextline
              AppendToNotionSnippetPage(
                notion,
                request.id,
                request.title,
                request.code,
                request.language,
                request.caption
              )
          );
      } else {
        vscode.commands.executeCommand("vscotionPlus.addIntegrationKey");
      }
    })
  );
}

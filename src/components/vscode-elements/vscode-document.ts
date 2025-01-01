import * as vscode from "vscode";

export const GetVScodeFileContent = () => {
  const editor = vscode.window.activeTextEditor;
  const selection = editor?.selection;
  if (selection && !selection.isEmpty) {
    const selectionRange = new vscode.Range(
      selection.start.line,
      selection.start.character,
      selection.end.line,
      selection.end.character
    );
    const highlighted = editor.document.getText(selectionRange);
    if (highlighted) {
      return {
        code: highlighted,
        language: editor.document.languageId,
        file: editor.document.uri.path,
      };
    }
  }
  throw Error("You can't make a snippet from nothing!");
};

import * as vscode from 'vscode';

export class SpecsFileDecorationProvider implements vscode.FileDecorationProvider {
  private _onDidChangeFileDecorations = new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();
  readonly onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;

  private modifiedFiles = new Set<string>();

  markModified(uri: vscode.Uri): void {
    this.modifiedFiles.add(uri.fsPath);
    this._onDidChangeFileDecorations.fire(uri);
  }

  clearModified(uri: vscode.Uri): void {
    this.modifiedFiles.delete(uri.fsPath);
    this._onDidChangeFileDecorations.fire(uri);
  }

  clearAll(): void {
    const uris = Array.from(this.modifiedFiles).map(p => vscode.Uri.file(p));
    this.modifiedFiles.clear();
    this._onDidChangeFileDecorations.fire(uris);
  }

  provideFileDecoration(uri: vscode.Uri): vscode.FileDecoration | undefined {
    if (this.modifiedFiles.has(uri.fsPath)) {
      return {
        badge: '●',
        color: new vscode.ThemeColor('gitDecoration.modifiedResourceForeground'),
        tooltip: 'Modified'
      };
    }
    return undefined;
  }
}

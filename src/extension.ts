import * as vscode from 'vscode';
import { GreenCodingAnalyzer } from './green-coding-analyzer';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.analyzeCode', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('Open a file to analyze.');
            return;
        }

        const filePath = editor.document.uri.fsPath;
        const analyzer = new GreenCodingAnalyzer(filePath);
        const result = analyzer.analyze();

        vscode.window.showInformationMessage(`Green Coding Score: ${result.score}/100`);
        if (result.issues.length) {
            vscode.window.showWarningMessage(result.issues.join('\n'));
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log("Green Coding Analyzer extension deactivated.");
}

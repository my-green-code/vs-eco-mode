import * as vscode from 'vscode';

let idleTimeout: NodeJS.Timeout;
const IDLE_TIME = 30000; // 30 seconds of inactivity

function setEnergySavingMode(enable: boolean) {
    try {
        console.log('Setting energy saving mode:', enable);
        const config = vscode.workspace.getConfiguration();
        config.update("editor.minimap.enabled", !enable, vscode.ConfigurationTarget.Global);
        config.update("editor.smoothScrolling", !enable, vscode.ConfigurationTarget.Global);
        config.update("terminal.integrated.gpuAcceleration", enable ? "off" : "auto", vscode.ConfigurationTarget.Global);
        config.update("cursor.inlineCompletions.enabled", !enable, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(enable ? "Eco Mode activated 💤" : "Eco Mode deactivated 🚀");
    } catch (error) {
        console.error('Error setting energy saving mode:', error);
    }
}

function resetIdleTimer() {
    clearTimeout(idleTimeout);
    setEnergySavingMode(false); // Reactivate everything when user returns
    idleTimeout = setTimeout(() => setEnergySavingMode(true), IDLE_TIME);
}

export function activate(context: vscode.ExtensionContext) {
    console.log('EcoMode extension activated');
    
    // Wait for the workspace to be ready
    setTimeout(() => {
        try {
            // Register toggle command
            console.log('Registering toggle command...');
            const toggleCommand = vscode.commands.registerCommand("ecoMode.toggle", () => {
                console.log('Toggle command executed');
                try {
                    const config = vscode.workspace.getConfiguration();
                    const isEnabled = config.get("editor.minimap.enabled") === false;
                    setEnergySavingMode(!isEnabled);
                } catch (error) {
                    console.error('Error in toggle command:', error);
                    vscode.window.showErrorMessage('Failed to toggle Eco Mode. Please try again.');
                }
            });

            // Register settings command
            console.log('Registering settings command...');
            const settingsCommand = vscode.commands.registerCommand("ecoMode.openSettings", () => {
                console.log('Settings command executed');
                try {
                    createWebViewPanel(context);
                } catch (error) {
                    console.error('Error opening settings:', error);
                    vscode.window.showErrorMessage('Failed to open Eco Mode settings. Please try again.');
                }
            });

            // Add subscriptions to context
            context.subscriptions.push(toggleCommand, settingsCommand);
            console.log('Commands registered successfully');

            // Initialize the idle timer
            resetIdleTimer();

            // Show initial status
            try {
                const config = vscode.workspace.getConfiguration();
                const isEnabled = config.get("editor.minimap.enabled") === false;
                vscode.window.showInformationMessage(isEnabled ? "Eco Mode is active 💤" : "Eco Mode is inactive 🚀");
            } catch (error) {
                console.error('Error showing initial status:', error);
            }

            // Log available commands
            Promise.resolve(vscode.commands.getCommands()).then(commands => {
                console.log('Available commands:', commands.filter(cmd => cmd.startsWith('ecoMode')));
            }).catch((error: unknown) => {
                console.error('Error getting available commands:', error);
            });

        } catch (error) {
            console.error('Error during extension initialization:', error);
            vscode.window.showErrorMessage('Failed to initialize Eco Mode extension. Please reload the window.');
        }
    }, 1000);
}

export function deactivate() {
    clearTimeout(idleTimeout);
}

function createWebViewPanel(context: vscode.ExtensionContext) {
    const panel = vscode.window.createWebviewPanel(
        'ecoModeView',
        'Eco Mode Settings',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = getWebviewContent();
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Eco Mode</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h2 { color: #007acc; }
                label { display: block; margin-top: 10px; }
            </style>
        </head>
        <body>
            <h2>Eco Mode Settings</h2>
            <label>
                <input type="checkbox" id="minimapToggle"> Disable Minimap
            </label>
            <label>
                <input type="checkbox" id="gpuToggle"> Disable GPU Acceleration
            </label>
            <label>
                <input type="checkbox" id="smoothScrollToggle"> Disable Smooth Scrolling
            </label>
            <button onclick="saveSettings()">Save</button>

            <script>
                const vscode = acquireVsCodeApi();

                function saveSettings() {
                    vscode.postMessage({
                        command: 'updateSettings',
                        minimap: document.getElementById('minimapToggle').checked,
                        gpu: document.getElementById('gpuToggle').checked,
                        smoothScroll: document.getElementById('smoothScrollToggle').checked
                    });
                }
            </script>
        </body>
        </html>
    `;
}


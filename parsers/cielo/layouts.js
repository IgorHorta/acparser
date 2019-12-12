const vscode = require('vscode');

const errorLayout = vscode.window.createTextEditorDecorationType({
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'red',
    color: 'red'
});

const infoLayout = vscode.window.createTextEditorDecorationType({});

module.exports = {errorLayout, infoLayout};
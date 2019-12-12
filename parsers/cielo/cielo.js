const vscode = require('vscode');
const cielo = require('../../acquirers/cielo');
const { LineFormatError } = require('../../errors/errors');
const { errorLayout, infoLayout } = require('./layouts');

const state = {
    currentLine: 0,
    processingHint: false
};

const createRange = (line, start, end) => {
    return new vscode.Range(new vscode.Position(line, start), new vscode.Position(line, end));
};

const getTypeFromLine = ({text, range}) => {
    const headerValue = text.charAt(0);
    let type = cielo.types.find(field => field.type.code === headerValue);
    if (!type) {
        throw new LineFormatError(`Não foi encontrado um tipo para o registro de valor ${headerValue}`, range);
    }
    return type;
};

const validateFile = async () => {
    let totalLines = vscode.window.activeTextEditor.document.lineCount;

    let { currentLine } = state;

    while (currentLine < totalLines) {
        console.info(`varrendo linha ${currentLine}`);
        const line = vscode.window.activeTextEditor.document.lineAt(currentLine);
        const { range, text } = line;

        if (line.isEmptyOrWhitespace) {
            if (currentLine >= totalLines - 1) {
                return;
            }
            throw new LineFormatError('O arquivo possui linha vazia', createRange(currentLine, range.start.character, cielo.endPosition));
        }

        let type = getTypeFromLine(line);
        if (range.end.character !== type.type.endPosition) {
            throw new LineFormatError(`São esperados ${type.endPosition} caracteres para a linha ${currentLine}`, range);
        }

        type.fields.forEach(field =>{
            if (field.validate) {
                const { error } = field.validate(text.substring(field.begin - 1, field.end));
                if (error) {
                    throw new LineFormatError(`${field.name} Erro: ${error.message}`, createRange(currentLine, field.begin - 1, field.end));
                }
            }
        });

        currentLine++;
    }
};

const showFormatError = (lineFormatError) => {

    const { range, message } = lineFormatError;

    vscode.window.activeTextEditor.revealRange(range, vscode.TextEditorRevealType.InCenter);
    vscode.window.activeTextEditor.setDecorations(errorLayout, [{range, hoverMessage: message}]);
    vscode.window.showErrorMessage(message);

    state.currentLine++;
};

const showLinesHint = (ranges) => {
    let infoDecorations = [];
    let linesWithDecoration = [];

    ranges.forEach(verticalRange => {
        const {start, end} = verticalRange;

        for(let i = start.line; i < end.line; i++) {

            if (linesWithDecoration.some((decoratedLine) => decoratedLine === i)) {
                continue;
            }

            linesWithDecoration.push(i);

            const line = vscode.window.activeTextEditor.document.lineAt(i);
            const type = getTypeFromLine(line);

            type.fields.forEach(field =>{
                const range = createRange(i, field.begin - 1, field.end);
                infoDecorations.push({range, hoverMessage: `${field.name} - ${field.description}`});
            });
        }
    });
    vscode.window.activeTextEditor.setDecorations(infoLayout, infoDecorations);
};

const parse = async () => {

    await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "I am long running!",
        cancellable: true
    }, (progress) => {
        progress.report({ increment: 0 });
        return progress;
    });



    // await vscode.window.showInformationMessage('Iniciando a validação do arquivo, isto pode demorar alguns minutos ...');

    await validateFile()
        .then(() => {
            vscode.window.showInformationMessage('Arquivo validado com sucesso!');
        })
        .catch((e) => { 
            if (e instanceof LineFormatError) {
                showFormatError(e);
            }
            console.error('Houve um erro durante a validação do arquivo', e);
        });

    showLinesHint(vscode.window.activeTextEditor.visibleRanges);

    vscode.window.onDidChangeTextEditorVisibleRanges(({visibleRanges}) => {
        if (!state.processingHint) {
            state.processingHint = true;
            showLinesHint(visibleRanges);
            state.processingHint = false;
        }
    });
};

module.exports = {
    parse
};


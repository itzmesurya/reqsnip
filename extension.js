// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var changeCase = require('change-case');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "reqsnip" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerCommand('extension.addReq', function () {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        //vscode.window.showInformationMessage('Hello World!Testing');
        var editor = vscode.window.activeTextEditor;
        var options = editor.options;
        var selection = editor.selection;
        var selectedText = editor.document.getText(selection);
        // convert the text to array
        var selectedTextConvertedToArray = selectedText.split(',');
        var replacementText = '';
        selectedTextConvertedToArray.forEach(function (element) {
            // surround each with require method
            replacementText = replacementText + "var " + changeCase.camelCase(element) + " = require('" + element + "');\n"
            // console.log("require('" + element + "')");
        });
        var textEdit = editFactory(selection, replacementText);
        applyEdit(editor.document, selection, replacementText);
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;


function positionFactory(line, char) {
    return new vscode.Position(line, char);
}


function editFactory(selection, content) {
    var range = new vscode.Range(positionFactory(selection.start.line, selection.start.character), positionFactory(selection.end.line, selection.end.character));
    return new vscode.TextEdit(range, content);
}

function workspaceEditFactory() {
    return new vscode.WorkspaceEdit();
}

function setEditFactory(uri, selection, content) {

    try {
        var workspaceEdit = workspaceEditFactory();
        // var edit = editFactory(selection, content);
        workspaceEdit.replace(uri, new vscode.Range(positionFactory(selection.start.line, selection.start.character), positionFactory(selection.end.line, selection.end.character)), content);
    } catch (error) {
        console.log(error);
    }

    return workspaceEdit;
}

function applyEdit(document, selection, content) {
    var edit = setEditFactory(document.uri, selection, content);
    vscode.workspace.applyEdit(edit);
}
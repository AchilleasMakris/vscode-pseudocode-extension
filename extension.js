const vscode = require("vscode");
const path = require("path");

function activate(context) {
  let runEapCommand = vscode.commands.registerCommand(
    "greekpseudocode.runEap",
    function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const filePath = editor.document.fileName; // Πλήρης διαδρομή αρχείου .eap
        const fileDir = path.dirname(filePath); // Διαδρομή φακέλου
        const fileName = path.basename(filePath); // Όνομα αρχείου
        const exeFileName = `${fileName}.exe`; // Δημιουργία ονόματος .eap.exe αρχείου

        // Δημιουργία τερματικού
        const terminal = vscode.window.createTerminal("EAP Runner", "cmd.exe");
        terminal.show();

        // Μεταγλώττιση του .eap αρχείου
        terminal.sendText(`pli10 "${filePath}"`, true);

        // Προσθήκη Enter για ολοκλήρωση μεταγλώττισης
        setTimeout(() => {
          terminal.sendText("", true);
        }, 1000);

        // Εκτέλεση του .eap.exe αρχείου
        setTimeout(() => {
          terminal.sendText(`"${exeFileName}"`, true); // Χρήση πλήρους ονόματος με .eap.exe
        }, 1500);
      } else {
        vscode.window.showErrorMessage("Δεν υπάρχει ενεργό αρχείο .eap για εκτέλεση.");
      }
    }
  );

  context.subscriptions.push(runEapCommand);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};

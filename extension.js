const vscode = require("vscode");
const path = require("path");

function activate(context) {
  let runEapCommand = vscode.commands.registerCommand(
    "greekpseudocode.runEap",
    function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const filePath = editor.document.fileName;
        const fileDir = path.dirname(filePath);
        const fileName = path.basename(filePath);
        const exeFileName = `${fileName}.exe`;

        // Δημιουργία τερματικού
        const terminal = vscode.window.createTerminal("EAP Runner");
        terminal.show();

        // Πηγαίνουμε στον φάκελο του αρχείου
        terminal.sendText(`cd "${fileDir}"`);

        // Μεταγλώττιση του .eap αρχείου
        terminal.sendText(`pli10 "${fileName}"`, true);

        // Προσθήκη αυτόματου Enter μετά την μεταγλώττιση
        setTimeout(() => {
          terminal.sendText("", true); // Αποστολή Enter
        }, 1000); // Αναμονή 1 δευτερολέπτου (εφόσον χρειάζεται χρόνος για το μήνυμα)

        // Εκτέλεση του .exe αρχείου
        setTimeout(() => {
          terminal.sendText(`"${exeFileName}"`);
        }, 1500); // Αναμονή για να βεβαιωθούμε ότι ολοκληρώθηκε η μεταγλώττιση
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

const vscode = require("vscode");
const path = require("path");

let terminal;

function activate(context) {
  const config = vscode.workspace.getConfiguration('greekpseudocode');
  const isMuted = config.get('muteNotification', false);

  if (!isMuted) {
    vscode.window.showInformationMessage(
      "Προστέθηκαν Snippets βοήθειας του κώδικα! Μάθετε περισσότερα για τη λειτουργία του Extension.",
      "Μάθε περισσότερα",
      "Mute notification"
    ).then(selection => {
      if (selection === "Μάθε περισσότερα") {
        vscode.env.openExternal(vscode.Uri.parse("https://github.com/AchilleasMakris/vscode-pseudocode-extension/wiki"));
      } else if (selection === "Mute notification") {
        config.update('muteNotification', true, vscode.ConfigurationTarget.Global);
      }
    });
  }

  let runEapCommand = vscode.commands.registerCommand(
    "greekpseudocode.runEap",
    function () {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const filePath = editor.document.fileName; // Πλήρης διαδρομή αρχείου .eap
        const fileDir = path.dirname(filePath); // Διαδρομή φακέλου
        const fileName = path.basename(filePath); // Όνομα αρχείου
        const exeFileName = `${fileName}.exe`; // Δημιουργία ονόματος .eap.exe αρχείου

        // Έλεγχος αν υπάρχει ήδη τερματικό
        if (!terminal || terminal.exitStatus) {
          terminal = vscode.window.createTerminal("EAP Runner", "cmd.exe");
        } else {
          // Στείλτε σήμα διακοπής (Ctrl+C) για να σταματήσει το τρέχον πρόγραμμα
          terminal.sendText("\x03", true);
        }
        
        terminal.show();

        // Καθαρισμός τερματικού
        setTimeout(() => {
          terminal.sendText("cls", true);

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
        }, 500); // Μικρή καθυστέρηση για να βεβαιωθούμε ότι η διακοπή έχει ολοκληρωθεί
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
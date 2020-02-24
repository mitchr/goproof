'use babel';

import { BufferedProcess } from 'atom'

export default {

  activate(state) {
    // placeholder for current cursor position
    pos = null
    atom.workspace.observeTextEditors(editor => {
      editor.buffer.onWillSave(callback => {
        if (editor.getRootScopeDescriptor().getScopesArray().includes('source.go')) {
          // grab current cursor position
          pos = editor.getCursorScreenPosition()

          // for some heinous reason, goimports -w does not work in this
          // context. instead we save the formatted text from stdout and fill
          // the current buffer with that text
          command = 'goimports'
          args = [editor.getPath()]
          stdout = (output) => editor.buffer.setText(output)
          exit = (code) => console.log("goimports -w " + editor.getPath())
          goimports = new BufferedProcess({command, args, stdout, exit})

          command = 'gofmt'
          args = ['-w', editor.getPath()]
          stdout = (output) => console.log(output)
          exit = (code) => console.log("gofmt -w " + editor.getPath())
          gofmt = new BufferedProcess({command, args, stdout, exit})
        }
      })

      editor.buffer.onDidSave(callback => {
        // reset cursor position back to where it was
        console.log(pos)
        editor.setCursorScreenPosition(pos)
      })
    })
  },

  deactivate() {
  },

};

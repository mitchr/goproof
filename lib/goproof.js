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

          command = 'goimports'
          args = ['-w', editor.getPath()]
          goimports = new BufferedProcess({command, args})
        }
      })

      editor.buffer.onDidSave(callback => {
        // reset cursor position back to where it was
        editor.setCursorScreenPosition(pos)

        command = 'gofmt'
        args = ['-w', editor.getPath()]
        gofmt = new BufferedProcess({command, args})
      })
    })
  },

  deactivate() {
  },

};

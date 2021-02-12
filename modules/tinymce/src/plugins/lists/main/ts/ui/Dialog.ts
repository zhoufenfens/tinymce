/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

import Editor from 'tinymce/core/api/Editor';
import { parseDetail, parseStartValue } from '../core/ListNumbering';
import { isOlNode } from '../core/NodeType';
import { getParentList } from '../core/Selection';

const open = (editor: Editor) => {
  // Find the current list and skip opening if the selection isn't in an ordered list
  const currentList = getParentList(editor);
  if (!isOlNode(currentList)) {
    return;
  }

  editor.windowManager.open({
    title: 'List Properties',
    body: {
      type: 'panel',
      items: [
        {
          type: 'input',
          name: 'start',
          label: 'Start list at number',
          inputMode: 'numeric'
        }
      ]
    },
    initialData: {
      start: parseDetail({
        start: editor.dom.getAttrib(currentList, 'start', '1'),
        listStyleType: editor.dom.getStyle(currentList, 'list-style-type')
      })
    },
    buttons: [
      {
        type: 'cancel',
        name: 'cancel',
        text: 'Cancel'
      },
      {
        type: 'submit',
        name: 'save',
        text: 'Save',
        primary: true
      }
    ],
    onSubmit: (api) => {
      const data = api.getData();
      parseStartValue(data.start).each((detail) => {
        editor.undoManager.transact(() => {
          editor.execCommand('mceListUpdate', false, {
            attrs: {
              start: detail.start === '1' ? '' : detail.start
            },
            styles: {
              'list-style-type': detail.listStyleType === false ? '' : detail.listStyleType
            }
          });
        });
      });
      api.close();
    }
  });
};

export {
  open
};

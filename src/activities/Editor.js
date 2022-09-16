import React, { useState } from "react";

import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";

import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";

import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/matchtags";
import "codemirror/addon/edit/continuelist";
import "codemirror/addon/edit/trailingspace";

import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/anyword-hint";
import "codemirror/addon/hint/css-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/xml-hint";

import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/indent-fold";
import "codemirror/addon/fold/markdown-fold";
import "codemirror/addon/fold/xml-fold";

import { Controlled as IDE } from "react-codemirror2";

export default function Editor(props) {
  const { language, /*displayName,*/ value, onChange } = props;
  //const [open, setOpen] = useState(true);

  return (
    <IDE
      onKeyUp={(editor, e) => {
        if (
          !e.shiftKey &&
          [8, 13, 32, 35, 36, 37, 38, 39, 40, 46, 219].indexOf(e.keyCode) < 0
        ) {
          editor.execCommand("autocomplete");
        }
      }}
      onBeforeChange={(editor, data, value) => onChange(value)}
      value={value}
      className="editor"
      options={{
        lineWrapping: true,
        lint: true,
        mode: language,
        theme: "darcula",
        lineNumbers: true,
        smartIndent: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        tabSize: 2,
        extraKeys: {
          "Ctrl-Space": function (cm, e) {
            cm.execCommand();
          },
          "Ctrl-Q": function (cm) {
            cm.foldCode(cm.getCursor("autocomplete"));
          },
        },
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
      }}
    />
  );
}

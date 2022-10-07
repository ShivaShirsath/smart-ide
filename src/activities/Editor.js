import React, { useState } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import { Controlled as IDE } from "react-codemirror2";

export default function Editor(props) {
  const { language, displayName, value, onChange } = props;
  const [open, setOpen] = useState(true);

  function handleChange(editor, data, value) {
    onChange(value);
  }

  return (
    <fieldset className={`${open ? "" : "collapsed"}`}>
      <legend>
        <button
          className="expand-collapse-btn"
          onClick={() => setOpen((prevOpen) => !prevOpen)}
        >
          {open ? `▲` : `▼`}
        </button>
        {displayName}
      </legend>
      <IDE
        onBeforeChange={handleChange}
        value={value}
        className="editor"
        options={{
          lineWrapping: true,
          lint: true,
          mode: language,
          theme: "darcula",
          lineNumbers: true,
        }}
      />
    </fieldset>
  );
}

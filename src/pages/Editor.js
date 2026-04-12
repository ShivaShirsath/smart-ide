import React, { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import ACTIONS from "../Actions";
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';
import { GoogleGenerativeAI } from "@google/generative-ai";

const files = {
  "index.html": {
    name: "index.html",
    language: "html",
    value: `<h1 align="center">
  Hello World !
</h1>
`,
  },
  "style.css": {
    name: "style.css",
    language: "html",
    value: `h1{
  color: gold;
}
`,
  },
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: `document.body.bgColor="black";`,
  },
};

const Editors = ({ socketRef, roomId, onCodeChange }) => {
  const [fileName] = useState("index.html");
  const editorRef = useRef(null);
  const chatEndRef = useRef(null);
  const file = files[fileName];
  const [user, setUser] = useState(true);
  const [input, setInput] = useState("");
  const [isInput, setIsInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [partialResponse, setPartialResponse] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const { speak, voices } = useSpeechSynthesis();
  const { listen } = useSpeechRecognition({
    onResult: (result) => {
      setInput(result);
    },
  });

  function handleEditorDidMount(editor, monaco) {
    monaco.editor.defineTheme("myDraculaTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "", foreground: "f8f8f2", background: "282a36" },
        { token: "invalid", foreground: "ff5555" },
        { token: "emphasis", fontStyle: "italic" },
        { token: "strong", fontStyle: "bold" },
        { token: "variable", foreground: "50fa7b" },
        { token: "variable.predefined", foreground: "50fa7b" },
        { token: "constant", foreground: "bd93f9" },
        { token: "comment", foreground: "6272a4" },
        { token: "number", foreground: "bd93f9" },
        { token: "number.hex", foreground: "bd93f9" },
        { token: "regexp", foreground: "f1fa8c" },
        { token: "annotation", foreground: "f1fa8c" },
        { token: "type", foreground: "bd93f9" },
        { token: "delimiter", foreground: "f8f8f2" },
        { token: "delimiter.html", foreground: "f8f8f2" },
        { token: "delimiter.xml", foreground: "f8f8f2" },
        { token: "tag", foreground: "ffb86c" },
        { token: "tag.id.pug", foreground: "f1fa8c" },
        { token: "tag.class.pug", foreground: "f1fa8c" },
        { token: "meta.scss", foreground: "f8f8f2" },
        { token: "metatag", foreground: "f8f8f2" },
        { token: "metatag.content.html", foreground: "f8f8f2" },
        { token: "metatag.html", foreground: "f8f8f2" },
        { token: "metatag.xml", foreground: "f8f8f2" },
        { token: "metatag.php", fontStyle: "bold" },
        { token: "key", foreground: "ff79c6" },
        { token: "string.key.json", foreground: "50fa7b" },
        { token: "string.value.json", foreground: "f8f8f2" },
        { token: "attribute.name", foreground: "50fa7b" },
        { token: "attribute.value", foreground: "f1fa8c" },
        { token: "attribute.value.number", foreground: "bd93f9" },
        { token: "attribute.value.unit", foreground: "bd93f9" },
        { token: "attribute.value.html", foreground: "bd93f9" },
        { token: "attribute.value.xml", foreground: "bd93f9" },
        { token: "string", foreground: "f1fa8c" },
        { token: "string.html", foreground: "f1fa8c" },
        { token: "string.sql", foreground: "f8f8f2" },
        { token: "string.yaml", foreground: "f8f8f2" },
        { token: "keyword", foreground: "ff79c6" },
        { token: "keyword.json", foreground: "f8f8f2" },
        { token: "keyword.flow", foreground: "BD93F9" },
        { token: "keyword.flow.scss", foreground: "BD93F9" },
        { token: "operator.scss", foreground: "F8F8F2" },
        { token: "operator.sql", foreground: "F8F8F2" },
        { token: "operator.swift", foreground: "F8F8F2" },
        { token: "predefined.sql", foreground: "50FA7B" },
      ],
      colors: {
        "editor.background": "#282A36",
        "editor.foreground": "#F8F8F2",
        "editor.lineHighlightBackground": "#44475A55",
        "editor.selectionBackground": "#44475A55",
        "editor.selectionHighlightBackground": "#44475A55",
        "editorCursor.foreground": "#F8F8F0",
        "editorSuggestWidget.highlightForeground": "#50FA7B",
      },
    });
    editorRef.current = editor;
    monaco.editor.setTheme("myDraculaTheme");

    onCodeChange(editorRef.current.getValue());
    listen();
  }

  function handleEditorChange(value, event) {
    if (editorRef.current) {
        onCodeChange(editorRef.current.getValue());

        if (user) {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code: value,
            pos: editorRef.current.getPosition(),
        });
        }
        if (!user) setUser(true);
    }
  }

  useEffect(() => {
    if (editorRef.current) {
      onCodeChange(editorRef.current.getValue());
    }
  }, [file.value, onCodeChange]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code, pos }) => {
        if (code !== null && editorRef.current) {
          editorRef.current.setValue(code);
          if (pos) {
            editorRef.current.setPosition(pos);
          }
          setUser(false);
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off(ACTIONS.CODE_CHANGE);
      }
    };
  }, [socketRef.current]);

  useEffect(() => {
    if (input.includes("over")) {
      apiCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const handleInput = (event) => {
    setInput(event.target.value);
  };

  const apiCall = async () => {
    if (input && input !== isInput) {
      setIsInput(input);
      setIsGenerating(true);
      setPartialResponse("");

      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey) {
        setChatHistory(prev => [...prev, 
          { role: "user", content: input },
          { role: "model", content: "⚠️ API Key not found. Please set REACT_APP_GEMINI_API_KEY in your .env file." }
        ]);
        setIsGenerating(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite-preview" });

      try {
        const history = chatHistory.map(msg => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
          history: history,
          generationConfig: {
            maxOutputTokens: 2000,
          },
        });

        const prompt = input.replace("over", "") + " in html. give code only. without backticks. without using code block. if code block having language then also only code";
        const result = await chat.sendMessageStream(prompt);
        
        let fullText = "";
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullText += chunkText;
          setPartialResponse(fullText);
        }

        let cleanCode = fullText;
        if (fullText.includes("```")) {
          const match = fullText.match(/```(?:[a-zA-Z]+)?\n([\s\S]*?)\n```/);
          if (match && match[1]) {
            cleanCode = match[1];
          } else {
            cleanCode = fullText.replace(/```/g, "");
          }
        }

        setChatHistory(prev => [
          ...prev,
          { role: "user", content: input },
          { role: "model", content: fullText }
        ]);

        if (editorRef.current) {
            editorRef.current.setValue(cleanCode.trim());
        }
      } catch (error) {
        console.error("Gemini API Error:", error);
        let errorMessage = error.message;
        
        // Handle Rate Limit (429) gracefully
        if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("quota exceeded")) {
          const retryMatch = errorMessage.match(/retry in ([\d.]+)s/);
          const retryTime = retryMatch ? `in ${Math.ceil(parseFloat(retryMatch[1]))} seconds` : "soon";
          errorMessage = `⚠️ AI is currently busy (Rate limit reached). Please try again ${retryTime}.`;
        } else {
          errorMessage = `❌ Error: ${errorMessage.split('\n')[0]}`; // Only show first line
        }

        setChatHistory(prev => [
          ...prev,
          { role: "user", content: input },
          { role: "model", content: errorMessage }
        ]);
      }

      setIsGenerating(false);
      setPartialResponse("");
      setInput("");
      setIsInput("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    apiCall();
  };

  return (
    <editor className={isSidebarOpen ? "with-sidebar" : ""}>
      <div className="main-editor-container">
        <Editor
          id="editor"
          onMount={handleEditorDidMount}
          path={file.name}
          onChange={handleEditorChange}
          defaultLanguage={file.language}
          defaultValue={file.value}
          roundedSelection={true}
          scrollBeyondLastLine={false}
        />
        <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? "→" : "←"} AI Chat
        </button>
      </div>

      <div className={`ai-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>AI Assistant</h3>
          <button className="close-sidebar" onClick={() => setIsSidebarOpen(false)}>×</button>
        </div>
        
        <div className="sidebar-chat-content">
          {(chatHistory.length > 0 || isGenerating) && (
            <div className="chat-history">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`chat-msg ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
              {isGenerating && (
                <div className="chat-msg model">
                  {partialResponse || "Thinking..."}
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        <form className="sidebar-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              id="input"
              placeholder="Ask anything..."
              value={input}
              onChange={handleInput}
            />
            <input type="button" className="voice-btn"
              onClick={() => {
                if (editorRef.current) {
                    speak({ text: editorRef.current.getValue(), voice: voices[12] });
                }
              }}
              value="🔊">
            </input>
          </div>
          <button type="submit" className="send-btn" disabled={isGenerating}>
            {isGenerating ? "..." : "Send"}
          </button>
        </form>
      </div>
    </editor>
  );
};

export default Editors;

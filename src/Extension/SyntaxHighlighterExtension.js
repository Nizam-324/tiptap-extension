// SyntaxHighlighterExtension.jsx
import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Highlight, themes } from "prism-react-renderer";
import React, { useEffect, useState } from "react";

const CodeBlockComponent = ({ node, updateAttributes }) => {
    const [language, setLanguage] = useState(node.attrs.language || "javascript");

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        setLanguage(newLanguage);
        updateAttributes({ language: newLanguage });
    };

    const [editor, setEditor] = useState(true)

    useEffect(() => {
      const element = document.querySelector('.code-block code div');
      if (element) {
        if (editor) {
          // Hide the div
          element.style.display = 'block';
        } else {
          // Show the div
          element.style.display = 'none';
        }
      }
    }, [editor]); // Run whenever 'editor' changes

    console.log(editor)

    return (
        <NodeViewWrapper className="code-block-wrapper">
            <div className="code-block-header">
                <button onClick={() => setEditor(!editor)}>{editor ? "Prettify" : "Edit code"}</button>
                <select value={language} onChange={handleLanguageChange} className="language-selector" contentEditable={false}>
                    <option value="javascript">JavaScript</option>
                    <option value="jsx">JSX</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="php">PHP</option>
                </select>
            </div>
            <div className="code-block">
                <NodeViewContent as="code">
                    {!editor && <Highlight theme={themes.dracula} code={node.textContent} language={language}>
                        {({ className, style, tokens, getLineProps, getTokenProps }) => (
                            <pre className={className} style={{ ...style, padding: "5px", margin: "0 0 10px 0" }}>
                                {tokens.map((line, i) => (
                                    <div key={i} {...getLineProps({ line, key: i })} style={{ display: "flex" }}>
                                        <span className="line-content">
                                            {line.map((token, key) => (
                                                <span key={key} {...getTokenProps({ token, key })} />
                                            ))}
                                        </span>
                                    </div>
                                ))}
                            </pre>
                        )}
                    </Highlight>}
                </NodeViewContent>
            </div>
        </NodeViewWrapper>
    );
};

export const SyntaxHighlighterExtension = Node.create({
    name: "codeBlock",
    group: "block",
    content: "text*",
    marks: "",
    code: true,
    defining: true,
    isolating: true,

    addAttributes() {
        return {
            language: {
                default: "javascript",
                parseHTML: (element) => element.getAttribute("language"),
                renderHTML: (attributes) => ({
                    language: attributes.language,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "pre",
                preserveWhitespace: "full",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["pre", HTMLAttributes, ["code", {}, 0]];
    },

    addKeyboardShortcuts() {
        return {
            Enter: () => {
                const { state, dispatch } = this.editor.view;
                const { selection } = state;
                const { $from, empty } = selection;

                if (!empty || !$from.parent.type.spec.code) {
                    return false;
                }

                dispatch(state.tr.insertText("\n"));
                return true;
            },
            Tab: () => {
                const { state, dispatch } = this.editor.view;

                if (!this.editor.isActive("codeBlock")) {
                    return false;
                }

                dispatch(state.tr.insertText("  "));
                return true;
            },
            Backspace: () => {
                const { state } = this.editor.view;
                const { selection, doc } = state;
                const { empty, $head } = selection;

                if (!empty || !$head.parent.type.spec.code) {
                    return false;
                }

                const isAtStart = $head.pos === $head.start();
                if (isAtStart && doc.textContent.length > 0) {
                    return true;
                }

                return false;
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(CodeBlockComponent);
    },
});

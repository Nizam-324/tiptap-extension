// src/components/Editor.jsx
import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { SyntaxHighlighterExtension } from '../Extension/SyntaxHighlighterExtension'
import { TextToSpeechExtension, TTSControls } from '../Extension/TextToSpeechExtension'
import MenuBar from './MenuBar'

const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      SyntaxHighlighterExtension,
      TextToSpeechExtension,
    ],
    content: `
      <h2>Welcome to the Tiptap Editor!</h2>
      <p>This is a rich text editor with syntax highlighting and text-to-speech capabilities.</p>
      
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="editor-wrapper">
      <MenuBar editor={editor} />
      <TTSControls editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor
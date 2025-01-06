// TextToSpeechExtension.js
import { Extension } from '@tiptap/core'
import React, { useState, useEffect } from 'react'

// React component for TTS controls
export const TTSControls = ({ editor }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [voices, setVoices] = useState([])
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [pitch, setPitch] = useState(1)
  const [rate, setRate] = useState(1)
  const [utterance, setUtterance] = useState(null)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)
      setSelectedVoice(availableVoices[0])
    }

    window.speechSynthesis.onvoiceschanged = loadVoices
    loadVoices()

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const handlePlay = () => {
    if (!editor) return

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      ' '
    )

    if (!selectedText) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    const newUtterance = new SpeechSynthesisUtterance(selectedText)
    newUtterance.voice = selectedVoice
    newUtterance.pitch = pitch
    newUtterance.rate = rate

    newUtterance.onend = () => {
      setIsPlaying(false)
    }

    setUtterance(newUtterance)
    setIsPlaying(true)
    window.speechSynthesis.speak(newUtterance)
  }

  return (
    <div className="tts-controls">
      <button 
        onClick={handlePlay}
        className="tts-button"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      
      <select
        value={selectedVoice?.name}
        onChange={(e) => {
          const voice = voices.find(v => v.name === e.target.value)
          setSelectedVoice(voice)
        }}
        className="voice-selector"
      >
        {voices.map(voice => (
          <option key={voice.name} value={voice.name}>
            {voice.name}
          </option>
        ))}
      </select>

      <div className="tts-settings">
        <label>
          Pitch:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
          />
        </label>
        
        <label>
          Speed:
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  )
}

// Text-to-speech extension
export const TextToSpeechExtension = Extension.create({
  name: 'textToSpeech',

  addCommands() {
    return {
      playSelection: () => ({ editor }) => {
        // Command implementation if needed
        return true
      }
    }
  }
})
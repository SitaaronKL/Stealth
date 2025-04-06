"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EditorHeader from "@/components/editor-header"
import EditorCanvas from "@/components/editor-canvas"
import ToolsPanel from "@/components/tools-panel"
import LayersPanel from "@/components/layers-panel"
import PropertiesPanel from "@/components/properties-panel"
import CollaborationPanel from "@/components/collaboration-panel"
import type { Layer, Tool, User, Comment } from "@/lib/types"
import { generateMockLayers, generateMockUsers, generateMockComments } from "@/lib/mock-data"
import BrushControls from "@/components/brush-controls"

export default function EditorWorkspace() {
  const [activeDocument, setActiveDocument] = useState({
    id: "doc-1",
    name: "Untitled Design",
    width: 1200,
    height: 800,
  })

  const [activeTool, setActiveTool] = useState<Tool>("move")
  const [layers, setLayers] = useState<Layer[]>(generateMockLayers())
  const [activeLayerId, setActiveLayerId] = useState<string>(layers[0]?.id || "")
  const [collaborators, setCollaborators] = useState<User[]>(generateMockUsers())
  const [comments, setComments] = useState<Comment[]>(generateMockComments())
  const [history, setHistory] = useState<Layer[][]>([layers])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [showCollaborators, setShowCollaborators] = useState(true)
  const [brushColor, setBrushColor] = useState("#000000")
  const [brushSize, setBrushSize] = useState(5)

  // Add a layer
  const addLayer = () => {
    const newLayer: Layer = {
      id: `layer-${Date.now()}`,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      opacity: 100,
      type: "raster",
      owner: "current-user",
      data: null,
    }

    const newLayers = [...layers, newLayer]
    setLayers(newLayers)
    setActiveLayerId(newLayer.id)

    // Update history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newLayers])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Delete a layer
  const deleteLayer = (id: string) => {
    if (layers.length <= 1) return // Don't delete the last layer

    const newLayers = layers.filter((layer) => layer.id !== id)
    setLayers(newLayers)

    if (activeLayerId === id) {
      setActiveLayerId(newLayers[newLayers.length - 1].id)
    }

    // Update history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newLayers])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Toggle layer visibility
  const toggleLayerVisibility = (id: string) => {
    const newLayers = layers.map((layer) => (layer.id === id ? { ...layer, visible: !layer.visible } : layer))
    setLayers(newLayers)

    // Update history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newLayers])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Toggle layer lock
  const toggleLayerLock = (id: string) => {
    const newLayers = layers.map((layer) => (layer.id === id ? { ...layer, locked: !layer.locked } : layer))
    setLayers(newLayers)
  }

  // Update layer opacity
  const updateLayerOpacity = (id: string, opacity: number) => {
    const newLayers = layers.map((layer) => (layer.id === id ? { ...layer, opacity } : layer))
    setLayers(newLayers)
  }

  // Add a comment
  const addComment = (x: number, y: number, text: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      x,
      y,
      text,
      author: "current-user",
      timestamp: new Date().toISOString(),
      resolved: false,
    }

    setComments([...comments, newComment])
  }

  // Resolve a comment
  const resolveComment = (id: string) => {
    const newComments = comments.map((comment) => (comment.id === id ? { ...comment, resolved: true } : comment))
    setComments(newComments)
  }

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setLayers([...history[historyIndex - 1]])
    }
  }

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setLayers([...history[historyIndex + 1]])
    }
  }

  // Add this function to your EditorWorkspace component
  const updateLayerData = (id: string, data: string) => {
    const newLayers = layers.map(layer => 
      layer.id === id ? { ...layer, data } : layer
    )
    setLayers(newLayers)

    // Update history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...newLayers])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-zinc-100">
      <EditorHeader
        documentName={activeDocument.name}
        undo={undo}
        redo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        collaborators={collaborators}
        showCollaborators={showCollaborators}
        toggleCollaborators={() => setShowCollaborators(!showCollaborators)}
      />

      <div className="flex flex-1 overflow-hidden">
        <ToolsPanel 
          activeTool={activeTool} 
          setActiveTool={setActiveTool}
          brushColor={brushColor}
          brushSize={brushSize}
          onBrushColorChange={setBrushColor}
          onBrushSizeChange={setBrushSize}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorCanvas
            document={activeDocument}
            layers={layers}
            activeLayerId={activeLayerId}
            activeTool={activeTool}
            collaborators={showCollaborators ? collaborators : []}
            comments={comments}
            addComment={addComment}
            updateLayerData={updateLayerData}
            brushColor={brushColor}
            brushSize={brushSize}
          />
        </div>

        <div className="w-80 border-l border-zinc-800 flex flex-col">
          <Tabs defaultValue="layers" className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 mx-4 mt-2">
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="collaboration">Collab</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="flex-1 p-0 m-0 overflow-hidden">
              <LayersPanel
                layers={layers}
                activeLayerId={activeLayerId}
                setActiveLayerId={setActiveLayerId}
                addLayer={addLayer}
                deleteLayer={deleteLayer}
                toggleVisibility={toggleLayerVisibility}
                toggleLock={toggleLayerLock}
                updateOpacity={updateLayerOpacity}
              />
            </TabsContent>

            <TabsContent value="properties" className="flex-1 p-0 m-0 overflow-hidden">
              <PropertiesPanel
                layer={layers.find((layer) => layer.id === activeLayerId)}
                updateOpacity={updateLayerOpacity}
              />
            </TabsContent>

            <TabsContent value="collaboration" className="flex-1 p-0 m-0 overflow-hidden">
              <CollaborationPanel collaborators={collaborators} comments={comments} resolveComment={resolveComment} />
            </TabsContent>

            <TabsContent value="tools" className="flex-1 p-0 m-0 overflow-hidden">
              {activeTool === "brush" && (
                <BrushControls
                  color={brushColor}
                  size={brushSize}
                  onColorChange={setBrushColor}
                  onSizeChange={setBrushSize}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


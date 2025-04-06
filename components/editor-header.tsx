"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Undo, Redo, Share2, Users, Download, Menu, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User } from "@/lib/types"

interface EditorHeaderProps {
  documentName: string
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  collaborators: User[]
  showCollaborators: boolean
  toggleCollaborators: () => void
}

export default function EditorHeader({
  documentName,
  undo,
  redo,
  canUndo,
  canRedo,
  collaborators,
  showCollaborators,
  toggleCollaborators,
}: EditorHeaderProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [name, setName] = useState(documentName)

  const handleRename = () => {
    setIsRenaming(false)
    // In a real app, we would save the new name to the server
  }

  return (
    <header className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center px-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>

        {isRenaming ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
            className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm w-48"
          />
        ) : (
          <div className="text-sm font-medium cursor-pointer hover:text-zinc-300" onClick={() => setIsRenaming(true)}>
            {name}
          </div>
        )}
      </div>

      <div className="flex items-center ml-6 space-x-1">
        <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo}>
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="text-xs" onClick={toggleCollaborators}>
          <Users className={`h-4 w-4 mr-1 ${showCollaborators ? "text-green-500" : ""}`} />
          {collaborators.length} Online
        </Button>

        <div className="flex -space-x-2">
          {collaborators.slice(0, 3).map((user) => (
            <Avatar key={user.id} className="h-6 w-6 border border-zinc-800">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-[10px]">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          ))}
          {collaborators.length > 3 && (
            <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">
              +{collaborators.length - 3}
            </div>
          )}
        </div>

        <Button variant="outline" size="sm" className="text-xs">
          <Share2 className="h-3 w-3 mr-1" />
          Share
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm" className="text-xs">
              Export
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              PNG
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              JPG
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              SVG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}


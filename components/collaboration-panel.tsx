"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User, Comment } from "@/lib/types"
import { Check, Clock } from "lucide-react"

interface CollaborationPanelProps {
  collaborators: User[]
  comments: Comment[]
  resolveComment: (id: string) => void
}

export default function CollaborationPanel({ collaborators, comments, resolveComment }: CollaborationPanelProps) {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all")

  const filteredComments = comments.filter((comment) => {
    if (filter === "all") return true
    if (filter === "active") return !comment.resolved
    if (filter === "resolved") return comment.resolved
    return true
  })

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="users" className="flex-1">
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="flex-1 p-4 space-y-4">
          <h3 className="text-sm font-medium">Active Collaborators</h3>

          <div className="space-y-2">
            {collaborators.map((user) => (
              <div key={user.id} className="flex items-center p-2 rounded hover:bg-zinc-800">
                <div className="relative">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-2 h-2 w-2 rounded-full bg-green-500 border border-zinc-900" />
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-zinc-400">{user.role}</div>
                </div>

                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: user.color }} />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800">
            <h3 className="text-sm font-medium mb-2">Permissions</h3>
            <div className="text-xs text-zinc-400 space-y-1">
              <p>• Anyone with the link can view</p>
              <p>• Only invited users can edit</p>
              <p>• Comments are enabled for all viewers</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="flex-1 p-0">
          <div className="p-4 border-b border-zinc-800">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Comments</h3>
              <div className="flex text-xs bg-zinc-800 rounded-md overflow-hidden">
                <button
                  className={`px-2 py-1 ${filter === "all" ? "bg-zinc-700" : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`px-2 py-1 ${filter === "active" ? "bg-zinc-700" : ""}`}
                  onClick={() => setFilter("active")}
                >
                  Active
                </button>
                <button
                  className={`px-2 py-1 ${filter === "resolved" ? "bg-zinc-700" : ""}`}
                  onClick={() => setFilter("resolved")}
                >
                  Resolved
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(100%-60px)]">
            {filteredComments.length === 0 ? (
              <div className="p-4 text-center text-zinc-500 text-sm">No comments found</div>
            ) : (
              <div className="p-2 space-y-2">
                {filteredComments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded-md ${comment.resolved ? "bg-zinc-800/30" : "bg-zinc-800"}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="text-[10px]">
                            {comment.author === "current-user"
                              ? "You"
                              : comment.author
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {comment.author === "current-user" ? "You" : comment.author}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-zinc-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(comment.timestamp)}
                      </div>
                    </div>

                    <div className="ml-8 text-sm mb-2">{comment.text}</div>

                    <div className="ml-8 flex justify-between items-center">
                      <div className="text-xs text-zinc-400">
                        At position ({Math.round(comment.x)}, {Math.round(comment.y)})
                      </div>

                      {!comment.resolved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs"
                          onClick={() => resolveComment(comment.id)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Folder, File, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FileItem {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileItem[]
  extension?: string
}

const sampleFiles: FileItem[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        children: [
          { id: "3", name: "Button.tsx", type: "file", extension: "tsx" },
          { id: "4", name: "Card.tsx", type: "file", extension: "tsx" },
          { id: "5", name: "Input.tsx", type: "file", extension: "tsx" },
        ],
      },
      {
        id: "6",
        name: "pages",
        type: "folder",
        children: [
          { id: "7", name: "index.tsx", type: "file", extension: "tsx" },
          { id: "8", name: "about.tsx", type: "file", extension: "tsx" },
        ],
      },
      {
        id: "9",
        name: "styles",
        type: "folder",
        children: [{ id: "10", name: "globals.css", type: "file", extension: "css" }],
      },
      { id: "11", name: "app.tsx", type: "file", extension: "tsx" },
    ],
  },
  { id: "12", name: "package.json", type: "file", extension: "json" },
  { id: "13", name: "tsconfig.json", type: "file", extension: "json" },
  { id: "14", name: "README.md", type: "file", extension: "md" },
]

export default function Sidebar() {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  const handleFileSelect = (file: FileItem) => {
    setSelectedFile(file)
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="explorer" className="flex-1">
        <TabsList className="w-full justify-start h-10 bg-muted/50 rounded-none border-b border-border">
          <TabsTrigger value="explorer" className="rounded-none data-[state=active]:bg-background">
            Explorer
          </TabsTrigger>
          <TabsTrigger value="search" className="rounded-none data-[state=active]:bg-background">
            Search
          </TabsTrigger>
          <TabsTrigger value="git" className="rounded-none data-[state=active]:bg-background">
            Git
          </TabsTrigger>
        </TabsList>
        <TabsContent value="explorer" className="flex-1 mt-0">
          <div className="p-2">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 px-2">Explorer</h2>
            <div className="space-y-1">
              {sampleFiles.map((file) => (
                <FileNode key={file.id} file={file} onFileSelect={handleFileSelect} selectedFile={selectedFile} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="search" className="mt-0 p-4">
          <p className="text-sm text-muted-foreground">Search functionality would go here.</p>
        </TabsContent>
        <TabsContent value="git" className="mt-0 p-4">
          <p className="text-sm text-muted-foreground">Git integration would go here.</p>
        </TabsContent>
      </Tabs>

      {/* Terminal Section */}
      <div className="h-[200px] border-t border-border">
        <div className="flex items-center px-4 py-2 bg-muted/50">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground">Terminal</h2>
        </div>
        <div className="p-2 font-mono text-xs h-[calc(200px-32px)] overflow-auto bg-card">
          <div className="text-primary">user@neurosurf:~$</div>
          <div className="text-muted-foreground">npm run dev</div>
          <div className="text-green-500">ready - started server on 0.0.0.0:3000, url: http://localhost:3000</div>
          <div className="text-green-500">event - compiled client and server successfully in 188 ms (17 modules)</div>
          <div className="text-primary">user@neurosurf:~$</div>
        </div>
      </div>
    </div>
  )
}

function FileNode({
  file,
  onFileSelect,
  selectedFile,
  level = 0,
}: {
  file: FileItem
  onFileSelect: (file: FileItem) => void
  selectedFile: FileItem | null
  level?: number
}) {
  const [isOpen, setIsOpen] = useState(level === 0)

  const handleToggle = () => {
    if (file.type === "folder") {
      setIsOpen(!isOpen)
    } else {
      onFileSelect(file)
    }
  }

  const isSelected = selectedFile?.id === file.id

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 text-sm rounded-md cursor-pointer",
          isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50",
          level > 0 && "ml-4",
        )}
        onClick={handleToggle}
      >
        {file.type === "folder" ? (
          <>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 mr-1 shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-1 shrink-0" />
            )}
            <Folder className="h-4 w-4 mr-2 shrink-0 text-blue-500" />
          </>
        ) : (
          <File className="h-4 w-4 mr-2 shrink-0 text-muted-foreground" />
        )}
        <span className="truncate">{file.name}</span>
      </div>
      {file.type === "folder" && isOpen && file.children && (
        <div className="mt-1">
          {file.children.map((child) => (
            <FileNode
              key={child.id}
              file={child}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}


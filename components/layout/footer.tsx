import Image from "next/image"

export default function Footer() {
  return (
    <div className="h-6 border-t border-border flex items-center justify-between px-4 bg-card text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/favicon-16x16-B2APYAk6z6tXY2UFfxtLKjRA9YR0Ng.png"
          alt="Nebula Logo"
          width={12}
          height={12}
        />
        <span>Powered by Nebula</span>
      </div>
      <div>
        <span>v1.0.0</span>
      </div>
    </div>
  )
}


'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, Play, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

/* Minimal typings for the YouTube IFrame API we use. */
declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, options: Record<string, unknown>) => unknown
    }
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiPromise: Promise<void> | null = null

function loadYouTubeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.YT?.Player) return Promise.resolve()
  if (apiPromise) return apiPromise

  apiPromise = new Promise<void>((resolve) => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    document.head.appendChild(tag)
  })
  return apiPromise
}

export function WatchPlayer({
  youtubeVideoId,
  title,
  size = 'lg',
}: {
  youtubeVideoId: string
  title: string
  size?: 'sm' | 'lg'
}) {
  const [open, setOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const mountRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<unknown>(null)

  const close = useCallback(() => setOpen(false), [])

  // Lock scroll + Escape to close while the player is open.
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  // Initialise the IFrame API player when opened.
  useEffect(() => {
    if (!open) {
      setReady(false)
      return
    }
    let cancelled = false

    loadYouTubeApi().then(() => {
      if (cancelled || !mountRef.current || !window.YT?.Player) return
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId: youtubeVideoId,
        playerVars: {
          autoplay: 1,
          // Distraction-free configuration:
          rel: 0, // no unrelated related videos at the end
          modestbranding: 1, // minimal YouTube branding
          iv_load_policy: 3, // hide video annotations
          controls: 1, // keep playback controls
          fs: 1, // allow fullscreen
          playsinline: 1,
          color: 'white',
        },
        events: {
          onReady: () => {
            if (!cancelled) setReady(true)
          },
        },
      })
    })

    return () => {
      cancelled = true
      const p = playerRef.current as { destroy?: () => void } | null
      p?.destroy?.()
      playerRef.current = null
    }
  }, [open, youtubeVideoId])

  return (
    <>
      <Button size={size} onClick={() => setOpen(true)}>
        <Play className="fill-current" data-icon="inline-start" />
        Watch Film
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Now playing: ${title}`}
          className="fixed inset-0 z-[100] flex flex-col bg-black"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="truncate font-serif text-sm font-medium text-white/90 sm:text-base">
              {title}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={close}
              className="text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X data-icon="inline-start" />
              Close
            </Button>
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            {!ready ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70">
                <Loader2 className="size-8 animate-spin" />
                <span className="text-sm">Loading film…</span>
              </div>
            ) : null}
            <div className="mx-auto aspect-video w-full max-w-6xl px-0 sm:px-6">
              {/* The IFrame API replaces this element with the player iframe. */}
              <div ref={mountRef} className="size-full" />
            </div>
          </div>

          <p className="px-4 pb-3 text-center text-xs text-white/40 sm:px-6">
            Distraction-free player — related videos, end screens, and annotations are hidden.
          </p>
        </div>
      ) : null}
    </>
  )
}

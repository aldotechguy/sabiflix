'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MovieCard } from '@/components/movie-card'
import type { Movie } from '@/lib/mock-data'

export function MovieCarousel({
  title,
  description,
  movies,
}: {
  title: string
  description?: string
  movies: Movie[]
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  function scrollBy(direction: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: direction * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h2>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollBy(-1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollBy(1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="w-[42vw] shrink-0 snap-start sm:w-44 lg:w-48"
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  )
}

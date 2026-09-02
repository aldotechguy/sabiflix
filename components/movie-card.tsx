import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Movie } from '@/lib/mock-data'

const categoryLabel: Record<Movie['category'], string> = {
  feature: 'Feature',
  short: 'Short',
  documentary: 'Documentary',
}

export function MovieCard({
  movie,
  className,
  priority = false,
}: {
  movie: Movie
  className?: string
  priority?: boolean
}) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card outline-none transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/40',
        className,
      )}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        <Image
          src={movie.posterUrl || '/placeholder.svg'}
          alt={`Poster for ${movie.title}`}
          fill
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-90" />
        <Badge
          variant="secondary"
          className="absolute left-2 top-2 bg-background/70 backdrop-blur-sm"
        >
          {categoryLabel[movie.category]}
        </Badge>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-center pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
            <Play className="size-3.5 fill-current" />
            Watch
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-0.5 p-3">
        <h3 className="truncate font-medium leading-tight" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {movie.year} &middot; {movie.country}
        </p>
      </div>
    </Link>
  )
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="aspect-[2/3] w-full animate-pulse bg-muted" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}

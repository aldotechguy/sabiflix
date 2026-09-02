import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play, ShieldCheck, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { MovieCarousel } from '@/components/movie-carousel'
import { MovieCard } from '@/components/movie-card'
import { movies, playlists, getPlaylistMovies } from '@/lib/mock-data'

export default function HomePage() {
  const featuredPlaylists = playlists.filter((p) => p.isFeatured)
  const latest = [...movies]
    .filter((m) => m.isActive)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 10)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex flex-1 flex-col gap-16 pb-8">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <Image
            src="/hero-cinema.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/50" />
          <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <Badge variant="secondary" className="gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Curated by humans, not algorithms
            </Badge>
            <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
              African stories, worth your full attention.
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              Stream the best of Nollywood, African cinema, short films, and documentaries
              in a calm, distraction-free player. No autoplay traps. No endless scroll.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" render={<Link href="/catalog" />}>
                <Play className="fill-current" data-icon="inline-start" />
                Browse the catalog
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/sign-up" />}>
                Create free account
                <ArrowRight data-icon="inline-end" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Every film reviewed by a moderator for quality.
            </div>
          </div>
        </section>

        {/* Featured Playlists */}
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12">
          {featuredPlaylists.map((playlist) => (
            <MovieCarousel
              key={playlist.id}
              title={playlist.name}
              description={playlist.description}
              movies={getPlaylistMovies(playlist)}
            />
          ))}
        </div>

        {/* Latest additions */}
        <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
                Latest Additions
              </h2>
              <p className="text-sm text-muted-foreground">
                Freshly curated and added to the library.
              </p>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/catalog" />}>
              View all
              <ArrowRight data-icon="inline-end" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {latest.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} priority={i < 5} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

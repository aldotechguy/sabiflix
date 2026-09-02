import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Globe, Heart, Languages, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WatchPlayer } from '@/components/watch-player'
import { MovieCard } from '@/components/movie-card'
import {
  getMovieById,
  getPrimarySource,
  movies,
  movieCast,
  CATEGORIES,
} from '@/lib/mock-data'

export function generateStaticParams() {
  return movies.map((m) => ({ id: m.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const movie = getMovieById(id)
  if (!movie) return { title: 'Film not found — SabiFlix' }
  return {
    title: `${movie.title} (${movie.year}) — SabiFlix`,
    description: movie.synopsis,
  }
}

const categoryLabel = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]))

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const movie = getMovieById(id)
  if (!movie) notFound()

  const source = getPrimarySource(movie.id)
  const cast = movieCast[movie.id] ?? []
  const related = movies
    .filter((m) => m.id !== movie.id && m.isActive && m.category === movie.category)
    .slice(0, 5)

  const facts = [
    { icon: Calendar, label: 'Year', value: String(movie.year) },
    { icon: Globe, label: 'Country', value: movie.country },
    { icon: Languages, label: 'Language', value: movie.language },
    { icon: Tag, label: 'Category', value: categoryLabel[movie.category] ?? movie.category },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Backdrop */}
        <div className="relative">
          <div className="absolute inset-0 h-[420px] overflow-hidden">
            <Image
              src={movie.posterUrl || '/placeholder.svg'}
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-110 object-cover object-top blur-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/90 to-background" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/catalog" />}
              className="mb-6"
            >
              <ArrowLeft data-icon="inline-start" />
              Back to catalog
            </Button>

            <div className="flex flex-col gap-8 pb-8 md:flex-row md:gap-10">
              {/* Poster */}
              <div className="mx-auto w-52 shrink-0 sm:w-64 md:mx-0">
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
                  <Image
                    src={movie.posterUrl || '/placeholder.svg'}
                    alt={`Poster for ${movie.title}`}
                    fill
                    sizes="256px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>{categoryLabel[movie.category] ?? movie.category}</Badge>
                    {!movie.isActive ? (
                      <Badge variant="secondary">Coming soon</Badge>
                    ) : null}
                  </div>
                  <h1 className="font-serif text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                    {movie.title}
                  </h1>
                  {movie.alternativeTitles.length > 0 ? (
                    <p className="text-sm italic text-muted-foreground">
                      Also known as {movie.alternativeTitles.join(', ')}
                    </p>
                  ) : null}
                </div>

                <p className="max-w-2xl leading-relaxed text-muted-foreground text-pretty">
                  {movie.synopsis}
                </p>

                <dl className="grid grid-cols-2 gap-4 sm:max-w-lg sm:grid-cols-4">
                  {facts.map((f) => (
                    <div key={f.label} className="flex flex-col gap-1">
                      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <f.icon className="size-3.5" />
                        {f.label}
                      </dt>
                      <dd className="text-sm font-medium">{f.value}</dd>
                    </div>
                  ))}
                </dl>

                {cast.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground">Starring</span>
                    <div className="flex flex-wrap gap-2">
                      {cast.map((actor) => (
                        <Badge key={actor} variant="outline">
                          {actor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {source ? (
                    <WatchPlayer
                      youtubeVideoId={source.youtubeVideoId}
                      title={`${movie.title} (${movie.year})`}
                    />
                  ) : (
                    <Button size="lg" disabled>
                      Not yet available
                    </Button>
                  )}
                  <Button variant="outline" size="lg">
                    <Heart data-icon="inline-start" />
                    Add to favorites
                  </Button>
                </div>
                {source ? (
                  <p className="text-xs text-muted-foreground">
                    Curated source: {source.youtubeChannelName} &middot; {source.quality}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 ? (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Separator className="mb-8" />
            <h2 className="mb-6 font-serif text-xl font-semibold tracking-tight sm:text-2xl">
              More {categoryLabel[movie.category] ?? ''} films
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {related.map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  )
}

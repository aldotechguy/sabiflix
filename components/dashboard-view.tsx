'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Clock, Film, Heart, Inbox, Plus, Send, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { MovieCard } from '@/components/movie-card'
import {
  favoriteMovieIds,
  filmRequests as seedRequests,
  filmSubmissions as seedSubmissions,
  getMovieById,
  watchHistory,
  type FilmRequest,
  type FilmSubmission,
} from '@/lib/mock-data'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function progressPercent(entry: { progressSeconds: number; durationSeconds: number }) {
  return Math.min(100, Math.round((entry.progressSeconds / entry.durationSeconds) * 100))
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  pending: 'secondary',
  approved: 'default',
  rejected: 'outline',
  open: 'secondary',
  found: 'default',
  closed: 'outline',
}

export function DashboardView() {
  const favorites = favoriteMovieIds
    .map((id) => getMovieById(id))
    .filter((m): m is NonNullable<ReturnType<typeof getMovieById>> => Boolean(m))

  const [requests, setRequests] = useState<FilmRequest[]>(
    seedRequests.filter((r) => r.userDisplayName === 'Tunde Bakare' || r.status === 'open'),
  )
  const [submissions, setSubmissions] = useState<FilmSubmission[]>(
    seedSubmissions.slice(0, 2),
  )

  function handleRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const title = String(data.get('requestedTitle') || '').trim()
    if (!title) return
    setRequests((prev) => [
      {
        id: `req-${Date.now()}`,
        userDisplayName: 'Ada Eze',
        requestedTitle: title,
        requestedAt: new Date().toISOString(),
        status: 'open',
      },
      ...prev,
    ])
    form.reset()
    toast.success('Film request submitted', {
      description: 'Our curators will review it soon.',
    })
  }

  function handleSubmission(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const title = String(data.get('title') || '').trim()
    const url = String(data.get('youtubeUrl') || '').trim()
    if (!title || !url) return
    setSubmissions((prev) => [
      {
        id: `sub-${Date.now()}`,
        userDisplayName: 'Ada Eze',
        title,
        youtubeUrl: url,
        youtubeVideoId: '',
        description: String(data.get('description') || ''),
        status: 'pending',
        adminNotes: null,
        submittedAt: new Date().toISOString(),
      },
      ...prev,
    ])
    form.reset()
    toast.success('Film submitted for review', {
      description: 'Thanks — a moderator will watch it shortly.',
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-3xl font-bold tracking-tight">Your dashboard</h1>
        <p className="text-muted-foreground">
          Track what you have watched, saved, requested, and submitted.
        </p>
      </div>

      <Tabs defaultValue="history" className="mt-8 gap-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="history">
            <Clock data-icon="inline-start" />
            Watch History
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Heart data-icon="inline-start" />
            Favorites
          </TabsTrigger>
          <TabsTrigger value="requests">
            <Inbox data-icon="inline-start" />
            Film Requests
          </TabsTrigger>
          <TabsTrigger value="submissions">
            <Upload data-icon="inline-start" />
            Submissions
          </TabsTrigger>
        </TabsList>

        {/* Watch History */}
        <TabsContent value="history">
          {watchHistory.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Clock />
                </EmptyMedia>
                <EmptyTitle>Nothing watched yet</EmptyTitle>
                <EmptyDescription>
                  Films you play will appear here so you can pick up where you left off.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col gap-3">
              {watchHistory.map((entry) => {
                const movie = getMovieById(entry.movieId)
                if (!movie) return null
                const pct = progressPercent(entry)
                return (
                  <Card key={entry.id}>
                    <CardContent className="flex items-center gap-4">
                      <Link
                        href={`/movie/${movie.id}`}
                        className="relative aspect-2/3 w-14 shrink-0 overflow-hidden rounded-md"
                      >
                        <Image
                          src={movie.posterUrl || '/placeholder.svg'}
                          alt={`${movie.title} poster`}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Link
                            href={`/movie/${movie.id}`}
                            className="truncate font-medium hover:text-primary"
                          >
                            {movie.title}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(entry.watchedAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div
                            className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                            role="progressbar"
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-24 shrink-0 text-right text-xs text-muted-foreground">
                            {pct === 100 ? 'Completed' : `${pct}% watched`}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Favorites */}
        <TabsContent value="favorites">
          {favorites.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Heart />
                </EmptyMedia>
                <EmptyTitle>No favorites saved</EmptyTitle>
                <EmptyDescription>
                  Tap the heart on any film to keep it here for later.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {favorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Film Requests */}
        <TabsContent value="requests">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Request a film</CardTitle>
                <CardDescription>
                  Can&apos;t find something? Tell our curators what to hunt down.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRequest}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="requestedTitle">Film title</FieldLabel>
                      <Input
                        id="requestedTitle"
                        name="requestedTitle"
                        placeholder="e.g. Living in Bondage (1992)"
                        required
                      />
                    </Field>
                    <Field>
                      <Button type="submit">
                        <Send data-icon="inline-start" />
                        Submit request
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">Your requests</h2>
              {requests.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Inbox />
                    </EmptyMedia>
                    <EmptyTitle>No requests yet</EmptyTitle>
                    <EmptyDescription>Requested titles will show up here.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                requests.map((req) => (
                  <Card key={req.id}>
                    <CardContent className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{req.requestedTitle}</span>
                        <span className="text-xs text-muted-foreground">
                          Requested {formatDate(req.requestedAt)}
                        </span>
                      </div>
                      <Badge variant={statusVariant[req.status]} className="capitalize">
                        {req.status === 'found' ? 'Found' : req.status}
                      </Badge>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        {/* Submissions */}
        <TabsContent value="submissions">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Submit your film</CardTitle>
                <CardDescription>
                  Filmmakers: share a YouTube link and our moderators will review it.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmission}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="title">Film title</FieldLabel>
                      <Input id="title" name="title" placeholder="Your film's title" required />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="youtubeUrl">YouTube URL</FieldLabel>
                      <Input
                        id="youtubeUrl"
                        name="youtubeUrl"
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Language, runtime, and a short synopsis."
                        rows={3}
                      />
                    </Field>
                    <Field>
                      <Button type="submit">
                        <Upload data-icon="inline-start" />
                        Submit for review
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">Your submissions</h2>
              {submissions.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Film />
                    </EmptyMedia>
                    <EmptyTitle>No submissions yet</EmptyTitle>
                    <EmptyDescription>
                      Films you submit for review will appear here with their status.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                submissions.map((sub) => (
                  <Card key={sub.id}>
                    <CardContent className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-4">
                        <span className="font-medium">{sub.title}</span>
                        <Badge variant={statusVariant[sub.status]} className="capitalize">
                          {sub.status}
                        </Badge>
                      </div>
                      <span className="truncate text-xs text-muted-foreground">
                        {sub.youtubeUrl}
                      </span>
                      {sub.adminNotes ? (
                        <>
                          <Separator />
                          <p className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Moderator note: </span>
                            {sub.adminNotes}
                          </p>
                        </>
                      ) : null}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

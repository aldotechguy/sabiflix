'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Clapperboard, LayoutDashboard, LogOut, Search, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/use-auth'
import { mockUser } from '@/lib/mock-data'

export function SiteHeader() {
  const router = useRouter()
  const { isSignedIn, signOut } = useAuth()
  const [query, setQuery] = useState('')

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/catalog?q=${encodeURIComponent(trimmed)}` : '/catalog')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Clapperboard className="size-5" />
          </span>
          <span className="font-serif text-xl font-bold tracking-tight">
            Sabi<span className="text-primary">Flix</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" render={<Link href="/catalog" />}>
            Catalog
          </Button>
        </nav>

        <form onSubmit={onSearch} className="ml-auto w-full max-w-xs sm:max-w-sm">
          <InputGroup>
            <InputGroupInput
              type="search"
              placeholder="Search films or actors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search films or actors"
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </form>

        {isSignedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label="Open account menu"
                  className="shrink-0 rounded-full outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
                />
              }
            >
              <Avatar className="size-9 border border-primary/40">
                <AvatarFallback className="bg-primary/15 text-primary">
                  {mockUser.initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{mockUser.displayName}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {mockUser.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <LayoutDashboard />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                  <User />
                  Profile
                </DropdownMenuItem>
                {mockUser.isAdmin ? (
                  <DropdownMenuItem onClick={() => router.push('/admin')}>
                    <Shield />
                    Admin Console
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  signOut()
                  router.push('/')
                }}
              >
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              render={<Link href="/sign-in" />}
              className="hidden sm:inline-flex"
            >
              Log in
            </Button>
            <Button size="sm" render={<Link href="/sign-up" />}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { HelpingHandIcon, Menu, X, CircleUserRound } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {signOut, useSession} from "next-auth/react";

function AuthButton() {
  const { data: session } = useSession();
  if (session) {
    return (
        <>
          <Button disabled={true}>{session?.user.name}</Button>
          <Button variant="ghost" className="w-full" onClick={() => signOut()}>Sign out</Button>
            <Button variant="ghost" className="w-full" asChild={true}>
                <Link href='/user/info'><CircleUserRound className="h-10 w-10"/></Link>
            </Button>
        </>
    );
  }
  return (
      <>
        <Button asChild variant="ghost" className="w-full">
          <Link href='/login'>Sign In</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/register">Sign Up</Link>
        </Button>
      </>
  );
}

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { data: session } = useSession();
    const navItems = session?.user?.role?.toLocaleLowerCase() === "admin" ? [
        { name: 'Solutions', href: '/' },
        { name: 'Activities', href: '/admin/activities' },
    ] : [
        { name: 'Solutions', href: '/' },
        { name: 'New Solution', href: '/solutions/new' },
    ];

  return (
    <nav className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <HelpingHandIcon className="h-8 w-8" />
            <span className="text-2xl font-bold">Helperly</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="hover:text-secondary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Login/Sign Up Buttons */}
          <div className="hidden md:flex space-x-2">
            <AuthButton />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 hover:text-secondary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 space-y-2">
              <AuthButton/>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
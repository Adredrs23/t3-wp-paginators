import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(nextRequest: NextRequest) {
  const response = NextResponse.next()
  const url = nextRequest.nextUrl.clone()

  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length

  if (
    url.pathname.match(/^\/api|static|_next|.netlify|favicon*/) ||
    url.pathname.includes('.svg') ||
    url.pathname.includes('.js') ||
    url.pathname.includes('.png') ||
    url.pathname.includes('.css') ||
    url.pathname.includes('.ico')
  )
    return response

  let nonce = ''
  let counter = 0

  while (counter < 44) {
    nonce += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  nonce = btoa(nonce)

  const csp = `
    base-uri 'self';     
    default-src 'self';     
    child-src 'self' 'unsafe-inline';    
    connect-src 'self' https://content.backend.com cdn-apac.onetrust.com vimeo.com player.vimeo.com https://plausible.io https://privacyportal-apac.onetrust.com;     
    font-src 'self' data:;     
    frame-src 'self' 'unsafe-inline' platform.twitter.com vimeo.com player.vimeo.com;     
    img-src 'self' https://content.backend.com i.vimeocdn.com data:;     
    manifest-src 'self';     
    media-src 'self';     
    object-src 'none';     
    script-src 'self' 'unsafe-inline' 'strict-dynamic'  www.googletagmanager.com vimeo.com player.vimeo.com 'nonce-LTclOktSe2fgnNk9YO5mjdLT2QpBnvZkJl0oAzXJ36dC';     
    script-src-elem 'self' 'unsafe-inline' www.googletagmanager.com vimeo.com player.vimeo.com;     
    style-src 'self' 'unsafe-inline';
  `

  response.headers.set('Content-Security-Policy', csp)

  if (!nextRequest.cookies.has('nonce')) {
    response.cookies.set('nonce', nonce)
  }

  return response
}

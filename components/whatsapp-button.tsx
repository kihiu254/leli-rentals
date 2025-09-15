"use client"

import React from "react"

const WHATSAPP_NUMBER = "+254112081866"
const DEFAULT_MESSAGE = "Hello%20I%20need%20assistance%20with%20a%20rental%20listing%20on%20Leli%20Rentals"

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${DEFAULT_MESSAGE}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className="fixed right-4 bottom-4 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="inline-block">
        <path fill="currentColor" d="M20.5 3.5A11.9 11.9 0 0012 .5C6.8.5 2.4 3.9 1 8.8L.1 12l3.2-1.1A11.9 11.9 0 0012 23.5c5.2 0 9.6-3.4 11-8.3 1.4-4.9-.1-10.1-2.5-11.7zM12 21c-1.9 0-3.7-.5-5.3-1.4L5 19l1.4-1.1C6.1 16.7 6 15.3 6 14c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7zm3.4-9.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.9.8-1.1 1-.2.1-.4.1-.6 0-.7-.3-2.2-.8-3.8-2.3-1.4-1.4-1.8-2.9-2.1-3.6-.2-.6 0-.9.1-1 .1-.1.3-.2.5-.3.2-.1.4-.1.6 0 .2.1 1.1.5 1.8 1 .6.4.9.6 1.5.9.6.3 1 .2 1.4 0 .3-.2.8-.6 1.1-.8.3-.2.6-.1.9 0 .3.1 1 .4 1.2.5.2.1.4.3.5.6.1.2.1.4 0 .6-.1.2-.6.8-.8 1-.2.2-.4.4-.2.7.1.3.4.6.8 1 .4.3.8.7.9 1 .1.2.1.4 0 .6-.1.4-.5 1.1-.6 1.3-.2.3-.6.4-1 .2z"/>
      </svg>
    </a>
  )
}

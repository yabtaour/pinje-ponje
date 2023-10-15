'use client'

import { Inter } from 'next/font/google'
import './globals.css'

import { NextUIProvider } from '@nextui-org/system'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (

    <html lang="en">

      <body className={inter.className} style={{ padding: '0' }}>
        {/* <main> */}

        <NextUIProvider>
          {children}
          {modal}
        </NextUIProvider>
        {/* </main> */}
      </body>
    </html >

  )
}


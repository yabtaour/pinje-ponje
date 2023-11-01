'use client'

import { Inter } from 'next/font/google'
import './globals.css'

import { ChakraProvider } from '@chakra-ui/react'
import { NextUIProvider } from '@nextui-org/system'
import { CookiesProvider } from 'react-cookie'


import { AuthProvider } from './globalRedux/provider'



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

        <AuthProvider>
          <NextUIProvider>
            <ChakraProvider>
            <CookiesProvider>
              {children}
              {modal}
              </CookiesProvider>
            </ChakraProvider>
          </NextUIProvider>
        </AuthProvider>
        {/* </main> */}
      </body>
    </html >

  )
}


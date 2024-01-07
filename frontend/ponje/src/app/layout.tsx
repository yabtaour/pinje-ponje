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
}: {
  children: React.ReactNode
}) {

  return (

    <html lang="en">
      {/* <body className={inter.className}> */}
      <body className={inter.className} style={{ padding: '0', backgroundColor: '#151424' }}>
        <AuthProvider>
          <NextUIProvider>
            <ChakraProvider>
              <CookiesProvider>
                {children}
              </CookiesProvider>
            </ChakraProvider>
          </NextUIProvider>
        </AuthProvider>
      </body>
    </html >

  )
}


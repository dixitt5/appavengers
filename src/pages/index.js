import Image from 'next/image'
import { Inter } from 'next/font/google'
import { ConnectKitButton } from 'connectkit'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main
      className={`flex bg-slate-950 min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
    
    </main>
  )
}

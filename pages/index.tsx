import { Inter } from 'next/font/google'
import Head from "next/head"

const inter = Inter({ subsets: ['latin'] })

const client_id = '823088350817b5fcb472';
const githubUrl = process.env.GITHUB_URL

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center p-24 bg-gray-800`}>
        <Head>
            <title>Login</title>
        </Head>
        <div className={'flex flex-col bg-gray-700 border-2 border-pink-700 shadow-xl p-20 text-center md justify-evenly items-center gap-10 rounded-md sm'}>
            <h1 className={'text-white text-4xl'}>Welcome</h1>
            <p className={'text-sm text-gray-400'}>Please login with your Github account</p>
            <a href={'https://github.com/login/oauth/authorize?client_id=823088350817b5fcb472'} className={'w-1/3 h-8'}><button className={'text-base bg-gray-600 text-gray-200 rounded-full w-full h-full hover:bg-pink-700'}>Login</button></a>
        </div>
    </main>
  )
}

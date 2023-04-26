import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const client_secret = 'ab3375dda2387cf2e6c666f759fdf65bd982b724';
const client_id = '823088350817b5fcb472';

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center p-24 bg-gray-100`}>
        <div className={'flex flex-col bg-white shadow-2xl p-20 text-center md justify-evenly items-center gap-10 rounded-md sm'}>
            <h1 className={'text-purple-700 text-4xl p-4'}>Welcome</h1>
            <a href='https://github.com/login/oauth/authorize?client_id=823088350817b5fcb472'><button className={'bg-amber-300 text-base text-purple-700 rounded-2xl w-64'}>Login with Github Account</button></a>
        </div>
    </main>
  )
}

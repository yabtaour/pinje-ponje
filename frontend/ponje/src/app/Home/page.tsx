import Link from 'next/link';
export default function Home() {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <div className="text-4xl font-bold mb-8">Hello, this is the main page</div>
            <div className="flex space-x-4">
                <Link href="/auth/sign-in" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
                        Sign In
                </Link>
                <Link href="/auth/sign-up" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
                        Sign Up
                </Link>
            </div>
        </div>
    );
}
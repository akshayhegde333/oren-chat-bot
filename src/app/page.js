import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
                <h1 className="text-4xl font-bold mb-8 text-center">Oren Support</h1>
                <p className="text-center mb-8">
                    Welcome to Oren support. Our AI-powered chatbot can help answer your questions about our product.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mb-8">
                    <h2 className="text-xl font-semibold mb-2">Setup Instructions</h2>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>
                            Add your OpenAI API key to <code className="bg-gray-100 px-1 rounded">.env.local</code> file
                        </li>
                        <li>
                            Update documentation links in <code className="bg-gray-100 px-1 rounded">src/app/api/chat/route.js</code> with your actual Oren documentation URLs
                        </li>
                        <li>
                            Optionally add a <code className="bg-gray-100 px-1 rounded">public/docs/oren-info.md</code> file with your detailed documentation
                        </li>
                        <li>
                            Restart the server after making these changes
                        </li>
                    </ol>
                </div>

                <div className="flex justify-center">
                    <Link
                        href="/chat"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Start Chatting
                    </Link>
                </div>
            </div>
        </main>
    );
} 
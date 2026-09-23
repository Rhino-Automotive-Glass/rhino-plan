import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Authentication error</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          The link is invalid or has expired. Please try again.
        </p>
        <Link href="/login" className="text-blue-600 hover:underline">
          Back to sign in
        </Link>
      </div>
    </main>
  );
}

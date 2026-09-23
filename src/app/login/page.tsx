import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8">
        <h1 className="text-2xl font-semibold mb-2">Rhino Plan</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Sign in with your Rhino account.</p>
        <LoginForm />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-20">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-emerald-300">
          abhi-dev
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
          Fresh Next.js and Tailwind workspace for Adure.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
          This branch starts clean for new development while keeping the main
          branch untouched.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-sm text-neutral-300">
          <span className="rounded border border-neutral-700 px-3 py-2">
            Next.js
          </span>
          <span className="rounded border border-neutral-700 px-3 py-2">
            Tailwind CSS
          </span>
          <span className="rounded border border-neutral-700 px-3 py-2">
            TypeScript
          </span>
        </div>
      </section>
    </main>
  );
}

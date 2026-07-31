import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-7xl font-light text-[#533afd]">404</p>
      <h1 className="mt-4 font-display text-2xl font-light text-[#061b31]">
        This page is not available
      </h1>
      <p className="mt-2 max-w-sm text-sm text-[#50617a]">
        The page you're looking for doesn't exist. Your future website,
        however, is four minutes away.
      </p>
      <div className="mt-7 flex gap-3">
        <Link href="/" className="btn-ghost px-5 py-2.5 text-sm">
          Go home
        </Link>
        <Link href="/start" className="btn-primary px-5 py-2.5 text-sm">
          Build my website
        </Link>
      </div>
    </div>
  );
}

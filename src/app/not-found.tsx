import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="fatal">
      <h1>This page wandered off.</h1>
      <Link className="button primary" href="/">
        Back to LabSprint
      </Link>
    </main>
  );
}

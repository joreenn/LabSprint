'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="fatal">
      <h1>Let’s try that again.</h1>
      <p>LabSprint couldn’t load this screen. Your saved progress is still in your account.</p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}

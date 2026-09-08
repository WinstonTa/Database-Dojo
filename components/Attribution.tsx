export function Attribution() {
  return (
    <footer className="border-t border-[var(--rule)] px-5 py-6 text-[0.8rem] leading-relaxed text-[var(--graphite)] sm:px-8">
      <p className="max-w-2xl">
        The concepts, worked scenarios, and exercises here follow{" "}
        <a
          href="https://web.csulb.edu/colleges/coe/cecs/dbdesign5/dbdesign.php"
          target="_blank"
          rel="noopener noreferrer"
        >
          Database Design
        </a>{" "}
        by Neal Terrell and David Brown (CSULB), used under{" "}
        <a
          href="http://creativecommons.org/licenses/by-nc-nd/4.0/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CC BY-NC-ND 4.0
        </a>
        . All wording and every diagram on this site are original and are not
        endorsed by the original authors.
      </p>
    </footer>
  );
}

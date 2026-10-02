import type { Metadata } from "next";
import Link from "next/link";
import PdfToPngConverter from "./PdfToPngConverter";

export const metadata: Metadata = {
  title: "PDF to PNG Converter – Convert PDF to PNG Online",
  description:
    "Convert PDF files to PNG images online. Fast, simple and mobile-friendly PDF to PNG converter.",
  alternates: {
    canonical: "/pdf-to-png",
  },
};

export default function PdfToPngPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight">
          PDF Converter
        </Link>

        <div className="hidden text-sm text-slate-500 sm:block">
          Fast · Simple · Online
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 pt-12 text-center sm:px-8 sm:pt-20">
        <div className="mb-5 inline-flex rounded-full border border-white/80 bg-white/60 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-xl">
          Free PDF to PNG converter
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Convert PDF to PNG
          <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            quickly and easily.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Convert PDF pages into PNG images directly from your
          browser. Fast, simple and mobile-friendly.
        </p>

        <div className="mt-10">
          <PdfToPngConverter />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">⚡</div>

            <h2 className="mt-4 font-semibold">
              Fast conversion
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Convert PDF pages into PNG images without installing
              desktop software.
            </p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">📱</div>

            <h2 className="mt-4 font-semibold">
              Mobile friendly
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use the converter on phones, tablets and desktop
              devices.
            </p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">🖼️</div>

            <h2 className="mt-4 font-semibold">
              PNG output
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Turn PDF pages into widely supported PNG image
              files.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl sm:p-8">
          <h2 className="text-2xl font-bold">
            PDF to PNG Converter
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600">
            A PDF to PNG converter changes PDF pages into PNG
            images. PNG is useful when you want an image format
            that supports high-quality graphics and transparency.
          </p>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            Upload your PDF file above and convert its pages into
            PNG images directly from your browser.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl sm:p-8">
          <h2 className="text-2xl font-bold">
            Frequently Asked Questions
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <h3 className="font-semibold">
                Can I convert a PDF to PNG online?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Yes. Upload your PDF and use the converter above
                to create PNG images from its pages.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Why convert PDF to PNG?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                PNG images are useful for sharing individual
                document pages, graphics and screenshots.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Do I need to install software?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                No. You can use this online converter directly
                from a supported browser.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl sm:p-8">
          <h2 className="text-2xl font-bold">
            More File Converters
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Explore other document conversion tools.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/pdf-to-jpg"
              className="rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="font-semibold">
                PDF to JPG
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Convert PDF pages to JPG images.
              </p>
            </Link>

            <Link
              href="/word-to-pdf"
              className="rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="font-semibold">
                Word to PDF
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Convert Word documents to PDF.
              </p>
            </Link>

            <Link
              href="/excel-to-pdf"
              className="rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="font-semibold">
                Excel to PDF
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Convert Excel spreadsheets to PDF.
              </p>
            </Link>

            <Link
              href="/ppt-to-pdf"
              className="rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="font-semibold">
                PowerPoint to PDF
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Convert PPT and PPTX presentations to PDF.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-slate-200/70 px-5 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PDF Converter. Simple online
        document conversion.
      </footer>
    </main>
  );
}
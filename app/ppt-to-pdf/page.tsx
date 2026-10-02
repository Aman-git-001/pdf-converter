import type { Metadata } from "next";
import PptToPdfConverter from "./PptToPdfConverter";

export const metadata: Metadata = {
  title: "PowerPoint to PDF Converter – Convert PPTX to PDF Online",
  description:
    "Convert PowerPoint PPT and PPTX files to PDF online. Fast, simple and mobile-friendly PowerPoint to PDF converter.",
  alternates: {
    canonical: "/ppt-to-pdf",
  },
};

export default function PptToPdfPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <a href="/" className="text-lg font-bold tracking-tight">
          PDF Converter
        </a>

        <div className="hidden text-sm text-slate-500 sm:block">
          Fast · Simple · Online
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 pt-12 text-center sm:px-8 sm:pt-20">
        <div className="mb-5 inline-flex rounded-full border border-white/80 bg-white/60 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-xl">
          Free PowerPoint to PDF converter
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Convert PowerPoint to PDF
          <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            quickly and easily.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Convert PPT and PPTX presentations into PDF files
          directly from your browser. No desktop software required.
        </p>

        <div className="mt-10">
          <PptToPdfConverter />
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
              Convert PowerPoint presentations into PDF files
              quickly.
            </p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">📱</div>

            <h2 className="mt-4 font-semibold">
              Mobile friendly
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use the converter comfortably on phones, tablets
              and desktop devices.
            </p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">📊</div>

            <h2 className="mt-4 font-semibold">
              PPT & PPTX supported
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Convert common Microsoft PowerPoint presentation
              formats to PDF.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl sm:p-8">
          <h2 className="text-2xl font-bold text-center">
            PowerPoint to PDF Converter
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-6 text-slate-500">
            Upload a PowerPoint presentation and convert it
            into a PDF document in a few clicks.
          </p>

          <div className="mt-6 text-sm leading-7 text-slate-600">
            <p>
              This online PPT to PDF converter supports both
              <strong> PPT </strong> and <strong> PPTX </strong>
              presentation files.
            </p>

            <p className="mt-3">
              PDF files are useful when you need to share,
              print or view a presentation across different
              devices while keeping the document layout intact.
            </p>
          </div>
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
                Can I convert PPTX to PDF?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Yes. Upload your PPTX presentation and select
                PDF as the output format.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Can I convert PPT to PDF?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Yes. The converter supports standard PPT files
                as well as PPTX files.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Do I need PowerPoint installed?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                No. The conversion is handled by the online
                converter, so you do not need PowerPoint installed
                on your device.
              </p>
            </div>
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
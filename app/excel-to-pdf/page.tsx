"use client";

import { useState } from "react";
import Link from "next/link";

export default function ExcelToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0] || null;

    setFile(selectedFile);
    setMessage("");
    setError("");
  }

  async function convertFile() {
    if (!file) {
      setError("Please select an Excel file first.");
      return;
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "";

    if (!["xls", "xlsx"].includes(extension)) {
      setError("Please select an XLS or XLSX file.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("target", "pdf");

      const response = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "Conversion failed.";

        try {
          const data = await response.json();

          if (data?.details) {
            errorMessage = data.details;
          } else if (data?.error) {
            errorMessage = data.error;
          }
        } catch {}

        throw new Error(errorMessage);
      }

      const blob = await response.blob();

      if (!blob.size) {
        throw new Error("The converted PDF is empty.");
      }

      const url = window.URL.createObjectURL(blob);

      const originalName = file.name.replace(/\.[^/.]+$/, "");

      const link = document.createElement("a");

      link.href = url;
      link.download = `${originalName}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setMessage(
        "Conversion completed. Your PDF has been downloaded."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong during conversion."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-green-200/40 blur-3xl" />

        <div className="absolute -right-32 top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
        >
          PDF Converter
        </Link>

        <Link
          href="/"
          className="text-sm text-slate-500 transition hover:text-slate-900"
        >
          All Converters
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 pt-12 text-center sm:px-8 sm:pt-20">
        <div className="mb-5 inline-flex rounded-full border border-white/80 bg-white/60 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-xl">
          Free online Excel to PDF converter
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Excel to PDF Converter
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Convert XLS and XLSX Excel spreadsheets to PDF
          online. Upload your Excel file and download your
          converted PDF quickly and easily.
        </p>

        {/* Converter Card */}
        <div className="mx-auto mt-10 max-w-2xl rounded-[28px] border border-white/80 bg-white/70 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-6">
          <label
            htmlFor="excel-file"
            className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/60 px-5 py-8 transition hover:border-green-400 hover:bg-white/80"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-2xl text-white shadow-lg">
              ↑
            </div>

            {file ? (
              <>
                <p className="max-w-full truncate text-sm font-semibold">
                  {file.name}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <p className="mt-3 text-xs font-medium text-green-600">
                  Click to choose another file
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold">
                  Choose an Excel file
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Supports XLS and XLSX files
                </p>
              </>
            )}

            <input
              id="excel-file"
              type="file"
              className="hidden"
              accept=".xls,.xlsx"
              onChange={handleFileChange}
            />
          </label>

          <button
            type="button"
            onClick={convertFile}
            disabled={!file || loading}
            className="group mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="relative flex h-5 w-5 items-center justify-center">
                  <span className="absolute h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                </span>

                <span className="animate-pulse">
                  Converting...
                </span>
              </>
            ) : (
              <>
                <span>Convert to PDF</span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </>
            )}
          </button>

          {loading && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">
              <div className="flex items-center gap-3 text-sm font-medium text-blue-700">
                <div className="relative h-5 w-5">
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                </div>

                <span>
                  Processing your Excel spreadsheet...
                </span>
              </div>

              <div className="mt-3 h-1 overflow-hidden rounded-full bg-blue-100">
                <div className="h-full w-1/2 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-blue-600" />
              </div>
            </div>
          )}

          {message && !loading && (
            <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-left text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">📊</div>

            <h2 className="mt-4 font-semibold">
              XLS and XLSX support
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Convert popular Microsoft Excel spreadsheet
              formats to PDF.
            </p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">⚡</div>

            <h2 className="mt-4 font-semibold">
              Simple conversion
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Upload your spreadsheet and convert it to PDF
              without complicated steps.
            </p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">📱</div>

            <h2 className="mt-4 font-semibold">
              Mobile friendly
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use the converter from phones, tablets and
              desktop browsers.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl sm:p-8">
          <h2 className="text-2xl font-bold">
            How to convert Excel to PDF
          </h2>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold">
                1. Upload your Excel file
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Select an XLS or XLSX spreadsheet from your
                computer, phone or tablet.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                2. Convert Excel to PDF
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Click the Convert to PDF button and wait while
                your spreadsheet is processed.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                3. Download the PDF
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Once conversion is complete, your PDF file will
                be downloaded automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl sm:p-8">
          <h2 className="text-2xl font-bold">
            Frequently asked questions
          </h2>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="font-semibold">
                Can I convert XLS to PDF?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Yes. XLS files are supported and can be converted
                to PDF using this online converter.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Can I convert XLSX to PDF?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Yes. Upload your XLSX spreadsheet and click
                Convert to PDF.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Do I need Microsoft Excel?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                No. You can use this web-based converter from a
                supported browser.
              </p>
            </div>

            <div>
              <h3 className="font-semibold">
                Can I use it on my phone?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Yes. The page is designed to work on mobile,
                tablet and desktop screens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Other Converters */}
      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 text-center sm:px-8">
        <h2 className="text-2xl font-bold">
          More PDF converters
        </h2>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
          Try another document conversion tool.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/pdf-to-png"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-blue-400"
          >
            PDF to PNG
          </Link>

          <Link
            href="/"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition hover:border-blue-400"
          >
            All Converters
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200/70 px-5 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PDF Converter. Simple
        online document conversion.
      </footer>

      <style jsx global>{`
        @keyframes loading {
          0% {
            transform: translateX(-120%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(220%);
          }
        }
      `}</style>
    </main>
  );
}
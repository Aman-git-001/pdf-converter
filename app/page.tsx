"use client";

import {
  DragEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ConverterLinks from "./components/ConverterLinks";

const formatLabels: Record<string, string> = {
  pdf: "PDF",
  odt: "ODT",
  ods: "ODS",
  jpg: "JPG",
  png: "PNG",
};

const conversionMap: Record<string, string[]> = {
  pdf: ["odt", "ods", "jpg", "png"],
  doc: ["pdf"],
  docx: ["pdf"],
  odt: ["pdf"],
  rtf: ["pdf"],
  txt: ["pdf"],
  ppt: ["pdf"],
  pptx: ["pdf"],
  odp: ["pdf"],
  xls: ["pdf"],
  xlsx: ["pdf"],
  ods: ["pdf"],
  csv: ["pdf"],
  jpg: ["pdf"],
  jpeg: ["pdf"],
  png: ["pdf"],
};

const supportedInputs = [
  "PDF",
  "DOC",
  "DOCX",
  "ODT",
  "RTF",
  "TXT",
  "PPT",
  "PPTX",
  "ODP",
  "XLS",
  "XLSX",
  "ODS",
  "CSV",
  "JPG",
  "JPEG",
  "PNG",
];

function getExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase() || "";
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState("pdf");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputExtension = useMemo(
    () => (file ? getExtension(file.name) : ""),
    [file]
  );

  const availableFormats = useMemo(() => {
    const targets = conversionMap[inputExtension] || [];

    return targets.map((value) => ({
      value,
      label: formatLabels[value] || value.toUpperCase(),
    }));
  }, [inputExtension]);

  useEffect(() => {
    if (availableFormats.length > 0) {
      setTarget(availableFormats[0].value);
    } else {
      setTarget("");
    }
  }, [availableFormats]);

  function selectFile(selectedFile: File | null) {
    if (!selectedFile) return;

    setFile(selectedFile);
    setMessage("");
    setError("");
    setIsDragging(false);
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      selectFile(selectedFile);
    }
  }

  function handleDragEnter(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!loading) {
      setIsDragging(true);
    }
  }

  function handleDragOver(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    if (!loading) {
      event.dataTransfer.dropEffect = "copy";
      setIsDragging(true);
    }
  }

  function handleDragLeave(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    setIsDragging(false);

    if (loading) return;

    const droppedFiles = event.dataTransfer.files;

    if (droppedFiles && droppedFiles.length > 0) {
      selectFile(droppedFiles[0]);
    }
  }

  function openFilePicker() {
    if (!loading) {
      fileInputRef.current?.click();
    }
  }

  async function convertFile() {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    if (!target) {
      setError("This file type is not supported yet.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("target", target);

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
        throw new Error("The converted file is empty.");
      }

      const url = window.URL.createObjectURL(blob);

      const originalName = file.name.replace(
        /\.[^/.]+$/,
        ""
      );

      const link = document.createElement("a");

      link.href = url;
      link.download = `${originalName}.${target}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setMessage(
        "Conversion completed. Your file has been downloaded."
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
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="absolute -right-32 top-40 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <div className="text-lg font-bold tracking-tight">
          PDF Converter
        </div>

        <div className="hidden text-sm text-slate-500 sm:block">
          Fast · Simple · Online
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 pt-12 text-center sm:px-8 sm:pt-20">
        <div className="mb-5 inline-flex rounded-full border border-white/80 bg-white/60 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-xl">
          Free online document converter
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Convert your files

          <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            quickly and easily.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Convert PDF, Word, Excel, PowerPoint, images and
          other supported document formats from your browser.
        </p>

        <div className="mx-auto mt-10 max-w-2xl rounded-[28px] border border-white/80 bg-white/70 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-6">
          
          {/* DRAG & DROP AREA */}
          <div
            onClick={openFilePicker}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex min-h-52 select-none flex-col items-center justify-center rounded-3xl border-2 border-dashed px-5 py-8 transition-all duration-200 ${
              isDragging
                ? "scale-[1.02] border-blue-500 bg-blue-50 shadow-lg"
                : "cursor-pointer border-slate-300 bg-white/60 hover:border-blue-400 hover:bg-white/80"
            }`}
          >
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg transition-all ${
                isDragging
                  ? "bg-blue-600 text-white scale-110"
                  : "bg-slate-900 text-white"
              }`}
            >
              ↑
            </div>

            {isDragging ? (
              <>
                <p className="text-base font-semibold text-blue-700">
                  Drop your file here
                </p>

                <p className="mt-2 text-xs text-blue-500">
                  Release to select this file
                </p>
              </>
            ) : file ? (
              <>
                <p className="max-w-full truncate text-sm font-semibold">
                  {file.name}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <p className="mt-3 text-xs font-medium text-blue-600">
                  Drop another file or click to choose
                </p>
              </>
            ) : (
              <>
                <p className="text-base font-semibold">
                  Drag & drop your file
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  or click here to choose a file
                </p>
              </>
            )}

            <input
              ref={fileInputRef}
              id="file"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.odt,.rtf,.txt,.ppt,.pptx,.odp,.xls,.xlsx,.ods,.csv,.jpg,.jpeg,.png"
            />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <select
              value={target}
              onChange={(event) =>
                setTarget(event.target.value)
              }
              disabled={!file || loading}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-medium outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {!file ? (
                <option value="">
                  Select a file first
                </option>
              ) : availableFormats.length === 0 ? (
                <option value="">
                  Format not supported
                </option>
              ) : (
                availableFormats.map((format) => (
                  <option
                    key={format.value}
                    value={format.value}
                  >
                    Convert to {format.label}
                  </option>
                ))
              )}
            </select>

            <button
              type="button"
              onClick={convertFile}
              disabled={!file || !target || loading}
              className="group flex min-w-[162px] items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
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
                  <span>Convert File</span>

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </div>

          {loading && (
            <div className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">
              <div className="flex items-center gap-3 text-sm font-medium text-blue-700">
                <div className="relative h-5 w-5">
                  <div className="absolute inset-0 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                </div>

                <span>
                  Processing your document...
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

      <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">⚡</div>

            <h2 className="mt-4 font-semibold">
              Fast conversion
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Convert supported documents without installing
              desktop software.
            </p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">📱</div>

            <h2 className="mt-4 font-semibold">
              Mobile friendly
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              The interface automatically adapts to phones,
              tablets and desktop screens.
            </p>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl">
            <div className="text-2xl">📄</div>

            <h2 className="mt-4 font-semibold">
              Many formats
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Work with popular PDF, Office, OpenDocument and
              image formats.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-5 pb-16 sm:px-8">
        <div className="rounded-3xl border border-white/80 bg-white/60 p-6 text-center backdrop-blur-xl sm:p-8">
          <h2 className="text-2xl font-bold">
            Supported file formats
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            PDF Converter supports popular document and image
            formats including:
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {supportedInputs.map((format) => (
              <span
                key={format}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ConverterLinks />

      <footer className="relative z-10 border-t border-slate-200/70 px-5 py-8 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PDF Converter. Simple online
        document conversion.
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
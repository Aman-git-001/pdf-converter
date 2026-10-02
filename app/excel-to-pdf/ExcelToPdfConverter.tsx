"use client";

import { useState } from "react";

export default function ExcelToPdfConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function convertFile() {
    if (!file) {
      setError("Please select an Excel file first.");
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
        throw new Error("The converted file is empty.");
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
        "Conversion completed. Your PDF file has been downloaded."
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
    <div className="mx-auto mt-10 max-w-2xl rounded-[28px] border border-white/80 bg-white/70 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-6">
      <label
        htmlFor="excel-to-pdf-file"
        className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-white/60 px-5 py-8 transition hover:border-blue-400 hover:bg-white/80"
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white shadow-lg">
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

            <p className="mt-3 text-xs font-medium text-blue-600">
              Tap to choose another Excel file
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-semibold">
              Choose an Excel spreadsheet
            </p>

            <p className="mt-2 text-xs text-slate-500">
              XLS and XLSX files are supported
            </p>
          </>
        )}

        <input
          id="excel-to-pdf-file"
          type="file"
          accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="hidden"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0] || null;

            setFile(selectedFile);
            setMessage("");
            setError("");
          }}
        />
      </label>

      <button
        type="button"
        onClick={convertFile}
        disabled={!file || loading}
        className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Converting..." : "Convert Excel to PDF →"}
      </button>

      {loading && (
        <div className="mt-4 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3">
          <div className="flex items-center gap-3 text-sm font-medium text-blue-700">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

            <span>Processing your spreadsheet...</span>
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-blue-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-600" />
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
  );
}
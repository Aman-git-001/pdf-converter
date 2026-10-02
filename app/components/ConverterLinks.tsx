const converterLinks = [
  {
    href: "/pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert PDF files into JPG images.",
  },
  {
    href: "/pdf-to-png",
    title: "PDF to PNG",
    description: "Convert PDF files into PNG images.",
  },
  {
    href: "/word-to-pdf",
    title: "Word to PDF",
    description: "Convert DOC and DOCX files to PDF.",
  },
  {
    href: "/excel-to-pdf",
    title: "Excel to PDF",
    description: "Convert XLS and XLSX spreadsheets to PDF.",
  },
  {
    href: "/ppt-to-pdf",
    title: "PowerPoint to PDF",
    description: "Convert PPT and PPTX presentations to PDF.",
  },
];

export default function ConverterLinks() {
  return (
    <section className="relative z-10 mx-auto max-w-5xl px-5 pb-16 sm:px-8">
      <div className="rounded-3xl border border-white/80 bg-white/60 p-6 backdrop-blur-xl sm:p-8">
        <h2 className="text-2xl font-bold">
          More File Converters
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Choose another converter for your document.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {converterLinks.map((converter) => (
            <a
              key={converter.href}
              href={converter.href}
              className="rounded-2xl border border-slate-200 bg-white/80 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="font-semibold">
                {converter.title}
              </h3>

              <p className="mt-1 text-sm leading-5 text-slate-500">
                {converter.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
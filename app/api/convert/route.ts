import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import {
  PDFDocument,
  rgb,
} from "pdf-lib";

const execFileAsync = promisify(execFile);

const LIBREOFFICE =
  "C:\\Program Files\\LibreOffice\\program\\soffice.exe";

const PDFTOPPM =
  "C:\\Users\\Aman Sharma\\Downloads\\Release-26.09.0-0\\poppler-26.09.0\\Library\\bin\\pdftoppm.exe";

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",

  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",

  docx:
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  pptx:
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  xlsx:
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

  odt: "application/vnd.oasis.opendocument.text",

  ods: "application/vnd.oasis.opendocument.spreadsheet",

  odp: "application/vnd.oasis.opendocument.presentation",
};

function cleanFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function getLibreOfficeFilter(
  inputExtension: string,
  target: string
) {
  if (target === "pdf") {
    if (
      ["doc", "docx", "odt", "rtf", "txt"].includes(
        inputExtension
      )
    ) {
      return "pdf:writer_pdf_Export";
    }

    if (
      ["ppt", "pptx", "odp"].includes(
        inputExtension
      )
    ) {
      return "pdf:impress_pdf_Export";
    }

    if (
      ["xls", "xlsx", "ods", "csv"].includes(
        inputExtension
      )
    ) {
      return "pdf:calc_pdf_Export";
    }

    return "pdf";
  }

  if (target === "docx") {
    return "docx:Office Open XML Text";
  }

  if (target === "pptx") {
    return "pptx:Impress MS PowerPoint 2007 XML";
  }

  if (target === "xlsx") {
    return "xlsx:Calc MS Excel 2007 XML";
  }

  if (target === "odt") {
    return "odt:writer8";
  }

  if (target === "ods") {
    return "ods:calc8";
  }

  if (target === "odp") {
    return "odp:impress8";
  }

  return target;
}

/*
=========================================================
IMAGE → PDF
=========================================================
*/

async function imageToPdf(
  inputBuffer: Buffer,
  extension: string
) {
  const pdfDoc = await PDFDocument.create();

  let image;

  if (
    extension === "jpg" ||
    extension === "jpeg"
  ) {
    image = await pdfDoc.embedJpg(
      inputBuffer
    );
  } else if (extension === "png") {
    image = await pdfDoc.embedPng(
      inputBuffer
    );
  } else {
    throw new Error(
      "This image format is not supported for PDF conversion yet. Please use JPG, JPEG, or PNG."
    );
  }

  const imageWidth = image.width;
  const imageHeight = image.height;

  /*
   * A4 size in PDF points.
   */

  const A4_WIDTH = 595.28;
  const A4_HEIGHT = 841.89;

  /*
   * Keep the original image ratio.
   */

  const scale = Math.min(
    A4_WIDTH / imageWidth,
    A4_HEIGHT / imageHeight
  );

  const displayedWidth =
    imageWidth * scale;

  const displayedHeight =
    imageHeight * scale;

  const page = pdfDoc.addPage([
    A4_WIDTH,
    A4_HEIGHT,
  ]);

  /*
   * Center image on page.
   */

  const x =
    (A4_WIDTH - displayedWidth) / 2;

  const y =
    (A4_HEIGHT - displayedHeight) / 2;

  page.drawImage(image, {
    x,
    y,
    width: displayedWidth,
    height: displayedHeight,
  });

  /*
   * White page background.
   */

  page.drawRectangle({
    x: 0,
    y: 0,
    width: A4_WIDTH,
    height: A4_HEIGHT,
    color: rgb(1, 1, 1),
    opacity: 0,
  });

  /*
   * Save PDF.
   */

  return Buffer.from(
    await pdfDoc.save()
  );
}

export async function POST(request: Request) {
  let tempDir = "";
  let profileDir = "";

  try {
    const formData =
      await request.formData();

    const file =
      formData.get("file");

    const target = String(
      formData.get("target") || ""
    ).toLowerCase();

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            "No file was uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedTargets = [
      "pdf",
      "jpg",
      "png",
      "docx",
      "pptx",
      "xlsx",
      "odt",
      "ods",
      "odp",
    ];

    if (
      !allowedTargets.includes(target)
    ) {
      return NextResponse.json(
        {
          error:
            "Unsupported target format.",
        },
        {
          status: 400,
        }
      );
    }

    const originalName =
      cleanFileName(file.name);

    const inputExtension =
      path
        .extname(originalName)
        .replace(".", "")
        .toLowerCase();

    const baseName =
      path.basename(
        originalName,
        path.extname(originalName)
      );

    const inputBuffer =
      Buffer.from(
        await file.arrayBuffer()
      );

    /*
    ========================================================
    IMAGE → PDF
    ========================================================
    */

    if (
      [
        "jpg",
        "jpeg",
        "png",
      ].includes(inputExtension) &&
      target === "pdf"
    ) {
      const outputBuffer =
        await imageToPdf(
          inputBuffer,
          inputExtension
        );

      return new NextResponse(
        outputBuffer,
        {
          status: 200,

          headers: {
            "Content-Type":
              "application/pdf",

            "Content-Disposition":
              `attachment; filename="${baseName}.pdf"`,

            "Content-Length":
              outputBuffer.length.toString(),
          },
        }
      );
    }

    /*
    ========================================================
    TEMP DIRECTORY
    ========================================================
    */

    tempDir =
      await fs.mkdtemp(
        path.join(
          os.tmpdir(),
          "vault-converter-"
        )
      );

    profileDir =
      await fs.mkdtemp(
        path.join(
          os.tmpdir(),
          "vault-lo-profile-"
        )
      );

    const inputPath =
      path.join(
        tempDir,
        originalName
      );

    await fs.writeFile(
      inputPath,
      inputBuffer
    );

    /*
    ========================================================
    PDF → JPG / PNG
    ========================================================
    */

    if (
      inputExtension === "pdf" &&
      [
        "jpg",
        "png",
      ].includes(target)
    ) {
      const outputPrefix =
        path.join(
          tempDir,
          "page"
        );

      const args = [
        "-r",
        "150",
        "-singlefile",
      ];

      if (target === "png") {
        args.push("-png");
      } else {
        args.push("-jpeg");
      }

      args.push(
        inputPath,
        outputPrefix
      );

      await execFileAsync(
        PDFTOPPM,
        args,
        {
          windowsHide: true,
          timeout: 120000,
        }
      );

      const outputPath =
        path.join(
          tempDir,
          `page.${target}`
        );

      try {
        await fs.access(
          outputPath
        );
      } catch {
        throw new Error(
          "PDF rendering completed, but the image file was not created."
        );
      }

      const outputBuffer =
        await fs.readFile(
          outputPath
        );

      return new NextResponse(
        outputBuffer,
        {
          status: 200,

          headers: {
            "Content-Type":
              MIME_TYPES[target],

            "Content-Disposition":
              `attachment; filename="${baseName}.${target}"`,

            "Content-Length":
              outputBuffer.length.toString(),
          },
        }
      );
    }

    /*
    ========================================================
    LIBREOFFICE CHECK
    ========================================================
    */

    try {
      await fs.access(
        LIBREOFFICE
      );
    } catch {
      throw new Error(
        `LibreOffice was not found at:\n${LIBREOFFICE}`
      );
    }

    /*
    ========================================================
    LIBREOFFICE CONVERSION
    ========================================================
    */

    const filter =
      getLibreOfficeFilter(
        inputExtension,
        target
      );

    const argumentsList = [
      "--headless",
      "--invisible",
      "--nodefault",
      "--nofirststartwizard",
      "--nologo",

      `-env:UserInstallation=file:///${profileDir.replace(
        /\\/g,
        "/"
      )}`,

      "--convert-to",
      filter,

      "--outdir",
      tempDir,

      inputPath,
    ];

    let stdout = "";
    let stderr = "";

    try {
      const result =
        await execFileAsync(
          LIBREOFFICE,
          argumentsList,
          {
            windowsHide: true,
            timeout: 180000,
            maxBuffer:
              10 * 1024 * 1024,
          }
        );

      stdout =
        result.stdout || "";

      stderr =
        result.stderr || "";
    } catch (conversionError: any) {
      stdout =
        conversionError?.stdout || "";

      stderr =
        conversionError?.stderr || "";

      throw new Error(
        `LibreOffice conversion failed.\n${
          stderr ||
          conversionError?.message ||
          "Unknown LibreOffice error."
        }`
      );
    }

    console.log(
      "LibreOffice:",
      stdout
    );

    console.log(
      "LibreOffice error:",
      stderr
    );

    /*
    ========================================================
    FIND OUTPUT
    ========================================================
    */

    const files =
      await fs.readdir(
        tempDir
      );

    const expectedOutput =
      path.join(
        tempDir,
        `${baseName}.${target}`
      );

    let finalPath =
      expectedOutput;

    try {
      await fs.access(
        expectedOutput
      );
    } catch {
      const possibleOutput =
        files.find(
          (item) =>
            path
              .extname(item)
              .toLowerCase() ===
              `.${target}` &&
            item.toLowerCase() !==
              originalName.toLowerCase()
        );

      if (!possibleOutput) {
        throw new Error(
          `LibreOffice did not create a .${target} file.\n\nLibreOffice output:\n${
            stdout ||
            stderr ||
            "No output was returned."
          }`
        );
      }

      finalPath =
        path.join(
          tempDir,
          possibleOutput
        );
    }

    const outputBuffer =
      await fs.readFile(
        finalPath
      );

    if (!outputBuffer.length) {
      throw new Error(
        "The converted file is empty."
      );
    }

    return new NextResponse(
      outputBuffer,
      {
        status: 200,

        headers: {
          "Content-Type":
            MIME_TYPES[target] ||
            "application/octet-stream",

          "Content-Disposition":
            `attachment; filename="${baseName}.${target}"`,

          "Content-Length":
            outputBuffer.length.toString(),
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "VAULT CONVERSION ERROR:",
      error
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unknown conversion error.";

    return NextResponse.json(
      {
        error:
          "Conversion failed.",

        details: message,
      },
      {
        status: 500,
      }
    );
  } finally {
    if (tempDir) {
      try {
        await fs.rm(
          tempDir,
          {
            recursive: true,
            force: true,
          }
        );
      } catch {}
    }

    if (profileDir) {
      try {
        await fs.rm(
          profileDir,
          {
            recursive: true,
            force: true,
          }
        );
      } catch {}
    }
  }
}
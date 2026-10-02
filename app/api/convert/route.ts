import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.CONVERSION_BACKEND_URL ||
  "https://pdf-converter-backend-ovjm.onrender.com";

export async function POST(request: Request) {
  try {
    const incomingFormData = await request.formData();

    const file = incomingFormData.get("file");
    const target = incomingFormData.get("target");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No file was uploaded.",
        },
        {
          status: 400,
        }
      );
    }

    if (!target) {
      return NextResponse.json(
        {
          error: "No target format was selected.",
        },
        {
          status: 400,
        }
      );
    }

    const backendFormData = new FormData();

    backendFormData.append("file", file, file.name);
    backendFormData.append("target", String(target));

    const backendResponse = await fetch(
      `${BACKEND_URL}/convert`,
      {
        method: "POST",
        body: backendFormData,
      }
    );

    const contentType =
      backendResponse.headers.get("content-type") ||
      "application/octet-stream";

    const contentDisposition =
      backendResponse.headers.get(
        "content-disposition"
      );

    if (!backendResponse.ok) {
      const errorText =
        await backendResponse.text();

      let errorMessage = "Conversion failed.";

      try {
        const errorJson =
          JSON.parse(errorText);

        errorMessage =
          errorJson?.error ||
          errorJson?.details ||
          errorMessage;
      } catch {
        if (errorText) {
          errorMessage = errorText;
        }
      }

      return NextResponse.json(
        {
          error: errorMessage,
        },
        {
          status: backendResponse.status,
        }
      );
    }

    const outputBuffer =
      await backendResponse.arrayBuffer();

    const responseHeaders =
      new Headers();

    responseHeaders.set(
      "Content-Type",
      contentType
    );

    if (contentDisposition) {
      responseHeaders.set(
        "Content-Disposition",
        contentDisposition
      );
    }

    responseHeaders.set(
      "Content-Length",
      outputBuffer.byteLength.toString()
    );

    return new NextResponse(
      outputBuffer,
      {
        status: 200,
        headers: responseHeaders,
      }
    );
  } catch (error) {
    console.error(
      "CONVERSION PROXY ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to connect to the conversion server.",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error.",
      },
      {
        status: 502,
      }
    );
  }
}
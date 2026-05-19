import { renderToBuffer } from "@react-pdf/renderer";
import { HouseManualPDF } from "@/lib/pdf/HouseManualPDF";
import type { HouseManualData } from "@/lib/schema";
import type { ManualMode } from "@/types";
import type { PDFTheme } from "@/lib/pdf/themes";
import { defaultTheme } from "@/lib/pdf/themes";
import React from "react";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data: HouseManualData = body.data || body;
    const mode: ManualMode = body.mode || "seller";
    const theme: PDFTheme = body.theme || defaultTheme;

    if (!data.propertyBasics?.address) {
      return new Response("Address is required", { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = React.createElement(HouseManualPDF, { data, mode, theme }) as any;
    const buffer = await renderToBuffer(element);

    const uint8 = new Uint8Array(buffer);
    return new Response(uint8, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="House-Manual.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response("Failed to generate PDF", { status: 500 });
  }
}

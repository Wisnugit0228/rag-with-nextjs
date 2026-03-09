import mammoth from "mammoth";
import * as XLSX from "xlsx";

export async function extractText(buffer: Buffer, filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();

  // ========= PDF =========
  if (ext === "pdf") {
    // @ts-ignore
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const data = await pdfParse(buffer);
    return data.text as string;
  }

  // ========= DOCX =========
  if (ext === "docx") {
    const data = await mammoth.extractRawText({ buffer });
    return data.value;
  }

  // ========= EXCEL =========
  if (ext === "xlsx" || ext === "xls") {
    const workbook = XLSX.read(buffer, { type: "buffer" });

    let text = "";

    workbook.SheetNames.forEach((sheet) => {
      const rows: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {
        header: 1,
      });

      rows.forEach((row) => {
        if (row?.length) {
          text += row.join(" ") + "\n";
        }
      });
    });

    return text;
  }

  // ========= TXT =========
  if (ext === "txt") {
    return buffer.toString("utf-8");
  }

  // ========= CSV =========
  if (ext === "csv") {
    const text = buffer.toString("utf-8");
    const lines = text.split("\n");
    return lines
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n");
  }

  // ========= JSON =========
  if (ext === "json") {
    const json = JSON.parse(buffer.toString("utf-8"));
    return JSON.stringify(json, null, 2);
  }

  throw new Error(`Unsupported file type: .${ext}`);
}

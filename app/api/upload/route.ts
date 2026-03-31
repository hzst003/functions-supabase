import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { replaceAllMaterialLists } from "@/lib/db";

export const runtime = "nodejs";

function parseNumber(v: unknown): string | null {
  if (v == null || v === "") return null;
  if (typeof v === "number" && !Number.isNaN(v)) return String(v);
  if (typeof v === "string") {
    const n = Number(v.trim().replace(/,/g, ""));
    return Number.isNaN(n) ? null : String(n);
  }
  return null;
}

function parseString(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "请选择要上传的 xlsx 文件" },
        { status: 400 }
      );
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buf, { type: "buffer" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!firstSheet) {
      return NextResponse.json(
        { error: "Excel 文件中没有工作表" },
        { status: 400 }
      );
    }
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
      raw: false,
      defval: "",
    });

    const toInsert: {
      项目名称: string | null;
      品名: string;
      材料编号: string;
      规格: string | null;
      数量: string;
      单位: string;
    }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const 品名 = parseString(row["品名"] ?? row["品名 "]);
      const 材料编号 = parseString(row["材料编号"] ?? row["材料编号 "]);
      const 数量Str = parseNumber(row["数量"] ?? row["数量 "]);
      if (!品名 || !材料编号) continue;
      const 数量 = 数量Str ?? "0";
      toInsert.push({
        项目名称: parseString(row["项目名称"] ?? row["项目名称 "]) ?? null,
        品名,
        材料编号,
        规格: parseString(row["规格"] ?? row["规格 "]) ?? null,
        数量,
        单位: parseString(row["单位"] ?? row["单位 "]) ?? "",
      });
    }

    if (toInsert.length === 0) {
      return NextResponse.json(
        { error: "未解析到有效数据，请确保表头包含：品名、材料编号、数量 等列" },
        { status: 400 }
      );
    }

    await replaceAllMaterialLists(toInsert);

    return NextResponse.json({
      success: true,
      count: toInsert.length,
      message: `成功导入 ${toInsert.length} 条记录（已先清空原有数据）`,
    });
  } catch (e) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "上传失败" },
      { status: 500 }
    );
  }
}

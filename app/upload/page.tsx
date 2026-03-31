"use client";

import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  LinearProgress,
  Link,
} from "@mui/material";
import NextLink from "next/link";

type UploadResponse = {
  success?: boolean;
  count?: number;
  message?: string;
  error?: string;
};

function parseUploadResponse(raw: string): UploadResponse | null {
  try {
    return JSON.parse(raw) as UploadResponse;
  } catch {
    return null;
  }
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResponse | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const raw = await res.text();
      const data = parseUploadResponse(raw);
      if (!res.ok) {
        const errorMessage =
          data?.error ??
          data?.message ??
          `上传失败（HTTP ${res.status}）${
            raw ? `：${raw.slice(0, 120)}` : ""
          }`;
        setResult({ success: false, error: errorMessage });
        return;
      }
      if (!data) {
        setResult({
          success: false,
          error: "服务端返回了非 JSON 响应，请检查线上函数日志",
        });
        return;
      }
      setResult({
        success: true,
        count: data.count,
        message: data.message ?? `成功导入 ${data.count} 条`,
      });
      setFile(null);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "上传失败",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10">
      <Container maxWidth="sm">
        <Box className="mt-8 mb-8 text-center">
          <Typography
            variant="h4"
            className="font-[family-name:var(--font-geist-sans)] text-[#333333]"
          >
            材料表导入
          </Typography>
          <Typography color="text.secondary" className="mt-2">
            上传 xlsx 文件，将数据写入数据库
          </Typography>
        </Box>

        <Paper elevation={3} className="p-4 md:p-6">
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Excel 表头需包含：项目名称、品名、材料编号、规格、数量、单位（第一行为表头）。其中
            <strong>项目名称列请填写“项目编号”</strong>，例如 0571HZ2026LX0675。
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button variant="outlined" component="label" fullWidth disabled={loading}>
                选择 xlsx 文件
                <input
                  type="file"
                  hidden
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileChange}
                />
              </Button>
              {file && (
                <Typography variant="body2" color="text.secondary">
                  已选：{file.name}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={!file || loading}
                fullWidth
              >
                {loading ? "上传中…" : "上传并导入"}
              </Button>
            </Box>
          </form>

          {loading && <LinearProgress sx={{ mt: 2 }} />}

          {result && (
            <Alert
              severity={result.success ? "success" : "error"}
              sx={{ mt: 2 }}
              onClose={() => setResult(null)}
            >
              {result.success ? result.message : result.error}
            </Alert>
          )}
        </Paper>

        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Link component={NextLink} href="/">
            返回首页查看材料列表
          </Link>
        </Box>
      </Container>
    </div>
  );
}

import { db, materialLists } from "@/lib/db";
import { Container, Paper, Typography } from "@mui/material";
import MaterialsDataGrid, { type MaterialRow } from "./components/MaterialsDataGrid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const materials = await db.select().from(materialLists);

  const rows: MaterialRow[] = materials.map((m, index) => ({
    id: m.id.toString(),
    序号: index + 1,
    项目名称: m.项目名称,
    品名: m.品名,
    材料编号: m.材料编号,
    规格: m.规格,
    数量: m.数量?.toString() ?? "",
    单位: m.单位,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10">
      <Container maxWidth="lg">
        <div className="-mt-16 mb-8 text-center">


        </div>

        <Paper elevation={3} className="p-4 md:p-6">
          {rows.length === 0 ? (
            <Typography color="text.secondary" align="center">
              暂无数据
            </Typography>
          ) : (
            <MaterialsDataGrid rows={rows} />
          )}
        </Paper>
      </Container>
    </div>
  );
}
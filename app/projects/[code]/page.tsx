import { db, materialLists, projectInfo } from "@/lib/db";
import { eq, or } from "drizzle-orm";
import { Container, Paper, Typography, Box } from "@mui/material";
import MaterialsDataGrid, {
  type MaterialRow,
} from "../../components/MaterialsDataGrid";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ code: string }>; // 在 Next 16 中 params 是 Promise，需要先 await
};

export default async function ProjectMaterialsPage(props: Props) {
  const { code } = await props.params;
  const decodedCode = decodeURIComponent(code);

  const [project] = await db
    .select()
    .from(projectInfo)
    .where(eq(projectInfo.code, decodedCode))
    .limit(1);

  const nameConditions = [eq(materialLists.项目名称, decodedCode)];
  if (project?.projectName) {
    nameConditions.push(eq(materialLists.项目名称, project.projectName));
  }

  const materials = await db
    .select()
    .from(materialLists)
    .where(or(...nameConditions));

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
        <Box className="-mt-16 mb-8 text-center">
          <Typography
            variant="h4"
            className="font-[family-name:var(--font-geist-sans)] text-[#333333]"
          >
            项目材料明细
          </Typography>
          <Typography color="text.secondary" className="mt-2">
            项目编号：{decodedCode}
            {project?.projectName ? `（项目名称：${project.projectName}）` : null}
          </Typography>
        </Box>

        <Paper elevation={3} className="p-4 md:p-6">
          {rows.length === 0 ? (
            <Typography color="text.secondary" align="center">
              暂无材料数据。
            </Typography>
          ) : (
            <MaterialsDataGrid rows={rows} />
          )}
        </Paper>
      </Container>
    </div>
  );
}


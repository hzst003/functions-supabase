import prisma from "@/lib/prisma";
import { Container, Paper, Typography, Box } from "@mui/material";
import ProjectsDataGrid, { type ProjectRow } from "./ProjectsDataGrid";

export default async function ProjectsPage() {
  const projects = await prisma.projectInfo.findMany({
    orderBy: { initiatedAt: "desc" },
  });

  const rows: ProjectRow[] = projects.map((p, index) => ({
    id: p.id.toString(),
    序号: index + 1,
    编号: p.code,
    项目名称: p.projectName,
    施工单位: p.constructionUnit,
    所属流程: p.workflow,
    发起时间: p.initiatedAt
      ? new Date(p.initiatedAt).toLocaleString()
      : "",
    发起人员: p.initiator,
    审批节点: p.approvalNode,
    紧急程度: p.urgencyLevel,
    审核状态: p.reviewStatus,
    接收时间: p.receivedAt
      ? new Date(p.receivedAt).toLocaleString()
      : "",
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10">
      <Container maxWidth="lg">
        <Box className="-mt-16 mb-8 text-center">
          <Typography
            variant="h4"
            className="font-[family-name:var(--font-geist-sans)] text-[#333333]"
          >
            项目信息列表
          </Typography>
          <Typography color="text.secondary" className="mt-2">
            显示通过 Excel 导入的项目信息
          </Typography>
        </Box>

        <Paper elevation={3} className="p-4 md:p-6">
          {rows.length === 0 ? (
            <Typography color="text.secondary" align="center">
              暂无项目信息，请先在“项目信息导入”页面上传 Excel。
            </Typography>
          ) : (
            <ProjectsDataGrid rows={rows} />
          )}
        </Paper>
      </Container>
    </div>
  );
}


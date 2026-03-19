"use client";

import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export type ProjectRow = {
  id: string;
  序号: number;
  编号: string;
  项目名称: string;
  施工单位: string | null;
  所属流程: string | null;
  发起时间: string;
  发起人员: string | null;
  审批节点: string | null;
  紧急程度: string | null;
  审核状态: string | null;
  接收时间: string;
};

const columns: GridColDef<ProjectRow>[] = [
  { field: "序号", headerName: "序号", width: 80 },
  { field: "编号", headerName: "编号", width: 160 },
  { field: "项目名称", headerName: "项目名称", flex: 1, minWidth: 180 },
  { field: "施工单位", headerName: "施工单位", flex: 1, minWidth: 180 },
  { field: "所属流程", headerName: "所属流程", flex: 1, minWidth: 160 },
  { field: "发起时间", headerName: "发起时间", width: 180 },
  { field: "发起人员", headerName: "发起人员", width: 120 },
  { field: "审批节点", headerName: "审批节点", flex: 1, minWidth: 160 },
  { field: "紧急程度", headerName: "紧急程度", width: 120 },
  { field: "审核状态", headerName: "审核状态", width: 120 },
  { field: "接收时间", headerName: "接收时间", width: 180 },
  // 操作列在组件里注入（需要 router）
];

type Props = {
  rows: ProjectRow[];
};

export default function ProjectsDataGrid({ rows }: Props) {
  const router = useRouter();

  const columnsWithActions: GridColDef<ProjectRow>[] = [
    ...columns,
    {
      field: "actions",
      headerName: "操作",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            const code = params.row.编号;
            if (!code) return;
            router.push(`/projects/${encodeURIComponent(code)}`);
          }}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ height: "75vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columnsWithActions}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
        sx={{
          border: 0,
          "& .MuiDataGrid-cell:focus": { outline: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "action.hover",
          },
        }}
      />
    </Box>
  );
}


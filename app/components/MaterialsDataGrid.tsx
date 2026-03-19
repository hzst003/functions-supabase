"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";

export type MaterialRow = {
  id: string; // 内部主键，不显示在表格（UUID）
  序号: number;
  项目名称: string | null;
  品名: string;
  材料编号: string;
  规格: string | null;
  数量: string;
  单位: string;
};

const columns: GridColDef<MaterialRow>[] = [
  { field: "序号", headerName: "序号", width: 80 },
  { field: "项目名称", headerName: "项目名称", flex: 1, minWidth: 120 },
  { field: "品名", headerName: "品名", flex: 1, minWidth: 120 },
  { field: "材料编号", headerName: "材料编号", flex: 1, minWidth: 120 },
  { field: "规格", headerName: "规格", flex: 1, minWidth: 100 },
  { field: "数量", headerName: "数量", width: 120 },
  { field: "单位", headerName: "单位", width: 80 },
];

type Props = {
  rows: MaterialRow[];
};

export default function MaterialsDataGrid({ rows }: Props) {
  return (
    <Box sx={{ height: "70vh", width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
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
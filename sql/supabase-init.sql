-- Run in Supabase SQL Editor
-- Creates tables used by this project: "ProjectInfo" and material_lists.

create extension if not exists pgcrypto;

create table if not exists public."ProjectInfo" (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  "projectName" text not null,
  "constructionUnit" text,
  workflow text,
  "initiatedAt" timestamptz,
  initiator text,
  "approvalNode" text,
  "urgencyLevel" text,
  "reviewStatus" text,
  "receivedAt" timestamptz
);

create index if not exists idx_projectinfo_initiatedat
  on public."ProjectInfo" ("initiatedAt" desc nulls last);

create table if not exists public.material_lists (
  id uuid primary key default gen_random_uuid(),
  "项目名称" text,
  "品名" text not null,
  "材料编号" text not null,
  "规格" text,
  "数量" text not null default '0',
  "单位" text not null default ''
);

create index if not exists idx_material_lists_project_name
  on public.material_lists ("项目名称");

create index if not exists idx_material_lists_material_code
  on public.material_lists ("材料编号");

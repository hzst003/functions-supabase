import { COVER_THUMB, PB_URL } from "@/lib/pb";

export const runtime = "nodejs";

/** PocketBase record ids are 15-char; collection ids may be `pbc_*`. */
const COLLECTION_ID_RE = /^(?:[a-z0-9]{15}|pbc_[0-9]+)$/i;
const RECORD_ID_RE = /^[a-z0-9]{15}$/i;
/** Filenames from PocketBase uploads (no path separators). */
const FILENAME_RE = /^[a-zA-Z0-9._-]+$/;

type RouteParams = {
  params: Promise<{
    collectionId: string;
    recordId: string;
    filename: string;
  }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const { collectionId, recordId, filename: rawFilename } = await params;
  const filename = decodeURIComponent(rawFilename);

  if (!COLLECTION_ID_RE.test(collectionId) || !RECORD_ID_RE.test(recordId)) {
    return new Response("Bad Request", { status: 400 });
  }
  if (!FILENAME_RE.test(filename) || filename.includes("..")) {
    return new Response("Bad Request", { status: 400 });
  }

  const thumb = new URL(request.url).searchParams.get("thumb");
  if (thumb !== null && thumb !== COVER_THUMB) {
    return new Response("Bad Request", { status: 400 });
  }

  const upstream = new URL(
    `${PB_URL}/api/files/${collectionId}/${recordId}/${encodeURIComponent(filename)}`,
  );
  if (thumb) upstream.searchParams.set("thumb", thumb);

  let response: Response;
  try {
    response = await fetch(upstream, {
      // Revalidate periodically; PocketBase filenames change on re-upload.
      next: { revalidate: 86400 },
    });
  } catch {
    return new Response("Bad Gateway", { status: 502 });
  }

  if (!response.ok) {
    return new Response(response.statusText || "Not Found", {
      status: response.status,
    });
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.startsWith("image/")) {
    return new Response("Unsupported Media Type", { status: 415 });
  }

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "public, max-age=86400");
  const length = response.headers.get("content-length");
  if (length) headers.set("Content-Length", length);

  return new Response(response.body, { status: 200, headers });
}

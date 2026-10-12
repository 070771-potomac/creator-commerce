"use client";

// The "Files" card of the edit page: the digital asset and the cover image.
// The current file / cover come from the server (DAL); after an upload the
// zone refreshes the page, so they update here.
import { FileIcon } from "@phosphor-icons/react";
import Image from "next/image";

import { UploadZone } from "@/components/products/upload-zone";
import { Label } from "@/components/ui/label";

// Same limits as app/api/uploadthing/core.ts (the server enforces them).
const MB = 1024 * 1024;
const MAX_ASSET_BYTES = 64 * MB;
const MAX_COVER_BYTES = 4 * MB;

// Checked by file extension: on Windows, browsers report .zip files with
// different MIME types (application/zip, application/x-zip-compressed).
function checkAsset(file: File) {
  if (!/\.(pdf|zip)$/i.test(file.name)) return "Only PDF or ZIP files can be sold as the product file.";
  if (file.size > MAX_ASSET_BYTES) return "The file is larger than 64 MB.";
  return null;
}

function checkCover(file: File) {
  if (!file.type.startsWith("image/")) return "The cover must be an image (PNG, JPG, WebP…).";
  if (file.size > MAX_COVER_BYTES) return "The image is larger than 4 MB.";
  return null;
}

export function ProductFiles({
  productId,
  file,
  coverUrl,
}: {
  productId: string;
  file: { name: string; size: string } | null;
  coverUrl: string | null;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Digital asset</Label>
        {file ? (
          <div className="flex items-center gap-2 border p-3 text-sm">
            <FileIcon className="size-5 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate font-medium">{file.name}</span>
            <span className="shrink-0 text-muted-foreground">{file.size}</span>
          </div>
        ) : null}
        <UploadZone
          endpoint="productAsset"
          productId={productId}
          accept=".pdf,.zip,application/pdf,application/zip"
          check={checkAsset}
          label={file ? "Replace file" : "Drop file or click to upload"}
          hint="PDF or ZIP, up to 64 MB"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Cover image</Label>
        {coverUrl ? (
          <div className="relative aspect-16/10 overflow-hidden border">
            <Image
              src={coverUrl}
              alt="Cover image"
              fill
              sizes="(min-width: 1024px) 30vw, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <UploadZone
          endpoint="coverImage"
          productId={productId}
          accept="image/*"
          check={checkCover}
          label={coverUrl ? "Replace cover" : "Drop image or click to upload"}
          hint="PNG, JPG or WebP, up to 4 MB"
          className={coverUrl ? undefined : "aspect-16/10"}
        />
      </div>
    </div>
  );
}

"use client";

// A drop zone (drag a file onto it, or click to choose one) that uploads to
// one of our UploadThing routes. The checks here only give quick, friendly
// messages — the server (app/api/uploadthing/core.ts) enforces the same rules,
// so they can't be bypassed from the browser.
import { UploadSimpleIcon } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useRef, useState, type DragEvent } from "react";

import { refreshAfterUploadAction } from "@/app/(master)/products/actions";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

type UploadZoneProps = {
  endpoint: "productAsset" | "coverImage";
  productId: string;
  // For the file picker, e.g. ".pdf,.zip" or "image/*".
  accept: string;
  // Returns an error message, or null when the file is acceptable.
  check: (file: File) => string | null;
  label: string; // "Drop file or click to upload"
  hint: string; // "PDF or ZIP, up to 64 MB"
  className?: string;
};

// Browsers on Windows report .zip files as "application/x-zip-compressed",
// a type UploadThing's routes don't list. Re-label them as the standard
// "application/zip" before the upload starts (the file itself is unchanged).
function normalizeType(file: File): File {
  const zipAliases = ["application/x-zip-compressed", "application/x-zip", ""];
  if (/\.zip$/i.test(file.name) && zipAliases.includes(file.type)) {
    return new File([file], file.name, { type: "application/zip", lastModified: file.lastModified });
  }
  return file;
}

// UploadThing's technical error messages → sentences for the user.
function friendlyError(message: string): string {
  if (message.includes("InvalidFileType")) return "This file type isn't allowed here.";
  if (message.includes("FileSizeMismatch") || message.includes("too large")) return "The file is too large.";
  return message || "Upload failed. Try again.";
}

export function UploadZone({ endpoint, productId, accept, check, label, hint, className }: UploadZoneProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { executeAsync: refreshAfterUpload } = useAction(refreshAfterUploadAction);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    uploadProgressGranularity: "fine",
    onBeforeUploadBegin: (files) => files.map(normalizeType),
    onUploadProgress: setProgress,
    // Runs after the server's onUploadComplete has saved the file to the
    // product. Expire the cached product data (updateTag in a Server
    // Action), then re-render the page with the new file / cover.
    onClientUploadComplete: async () => {
      await refreshAfterUpload();
      setProgress(0);
      router.refresh();
    },
    onUploadError: (uploadError) => {
      setProgress(0);
      setError(friendlyError(uploadError.message));
    },
  });

  function upload(files: FileList | null) {
    const file = files?.[0];
    if (!file || isUploading) return;
    setError(null);

    const problem = check(file);
    if (problem) {
      setError(problem);
      return;
    }
    void startUpload([file], { productId });
  }

  function onDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    upload(event.dataTransfer.files);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <button
        type="button"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault(); // needed, or the browser opens the file
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex flex-col items-center justify-center gap-1 border border-dashed p-6 text-center text-sm text-muted-foreground transition-colors",
          "hover:bg-muted/50 focus-visible:border-ring focus-visible:outline-none disabled:cursor-wait",
          dragging && "border-primary bg-primary/5",
          error && "border-destructive",
          className,
        )}
      >
        <UploadSimpleIcon className="size-5" />
        {isUploading ? `Uploading… ${progress}%` : label}
        <span className="text-xs">{hint}</span>
        {isUploading ? (
          <span className="mt-2 h-1 w-full max-w-48 bg-muted" aria-hidden>
            <span className="block h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
          </span>
        ) : null}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => {
          upload(event.target.files);
          event.target.value = ""; // allow choosing the same file again
        }}
      />
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

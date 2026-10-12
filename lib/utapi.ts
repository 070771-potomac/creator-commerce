// UploadThing's server API client — shared by the upload route (deleting
// replaced files, S8) and the download route (reading files, S11).
// Server-only: it uses UPLOADTHING_TOKEN, which can delete any file.
import "server-only";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi(); // reads UPLOADTHING_TOKEN from the environment

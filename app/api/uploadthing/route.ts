// /api/uploadthing — the endpoint for the file router in ./core.ts.
// GET: the browser reads the upload rules (types, sizes).
// POST: the browser asks to upload (middleware runs), and UploadThing calls
// back when a file has arrived (onUploadComplete runs).
import { createRouteHandler } from "uploadthing/next";

import { uploadRouter } from "./core";

export const { GET, POST } = createRouteHandler({ router: uploadRouter });

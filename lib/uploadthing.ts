// Typed React helpers for the upload routes in app/api/uploadthing/core.ts.
// Only the router's TYPE is imported (`import type`), so no server code ends
// up in the browser bundle; TypeScript still checks endpoint names and inputs.
import { generateReactHelpers } from "@uploadthing/react";

import type { UploadRouter } from "@/app/api/uploadthing/core";

export const { useUploadThing } = generateReactHelpers<UploadRouter>();

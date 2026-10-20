import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  let publicId: unknown;
  let imageUrl: unknown;
  try {
    ({ publicId, imageUrl } = await request.json());
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof publicId !== "string" || publicId.length < 1 || publicId.length > 500) {
    return Response.json({ error: "Invalid Cloudinary asset ID." }, { status: 400 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return Response.json({ error: "Cloudinary server credentials are missing." }, { status: 500 });
  }

  if (typeof imageUrl !== "string") {
    return Response.json({ error: "Workshop image URL is required." }, { status: 400 });
  }
  try {
    const parsedUrl = new URL(imageUrl);
    const path = parsedUrl.pathname.split("/").filter(Boolean);
    if (
      parsedUrl.hostname !== "res.cloudinary.com" ||
      path[0] !== cloudName ||
      path[1] !== "image" ||
      path[2] !== "upload"
    ) {
      return Response.json({ error: "Image does not belong to this Cloudinary account." }, { status: 400 });
    }
    const assetParts = path.slice(3);
    const versionIndex = assetParts.findIndex((part) => /^v\d+$/.test(part));
    const publicIdParts = versionIndex >= 0 ? assetParts.slice(versionIndex + 1) : assetParts;
    if (!publicIdParts.length) {
      return Response.json({ error: "Could not identify the Cloudinary image." }, { status: 400 });
    }
    const last = publicIdParts.at(-1)!;
    publicIdParts[publicIdParts.length - 1] = last.replace(/\.[^.]+$/, "");
    if (decodeURIComponent(publicIdParts.join("/")) !== publicId) {
      return Response.json({ error: "Cloudinary image ID does not match its URL." }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Invalid Cloudinary image URL." }, { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHash("sha1")
    .update(`invalidate=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
  const body = new URLSearchParams({ public_id: publicId, timestamp, invalidate: "true", api_key: apiKey, signature });

  try {
    const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const cloudinaryResult = await cloudinaryResponse.json();
    if (!cloudinaryResponse.ok || !["ok", "not found"].includes(cloudinaryResult.result)) {
      return Response.json({ error: cloudinaryResult.error?.message || "Cloudinary could not delete the image." }, { status: 502 });
    }

    const workshop = await prisma.workshop.findFirst({
      where: { OR: [{ imagePublicIds: { has: publicId } }, { imageUrls: { has: imageUrl } }] },
    });
    if (workshop) {
      const publicIdIndex = workshop.imagePublicIds.indexOf(publicId);
      const urlIndex = workshop.imageUrls.indexOf(imageUrl);
      const imagePublicIds = publicIdIndex < 0
        ? workshop.imagePublicIds
        : workshop.imagePublicIds.filter((_, itemIndex) => itemIndex !== publicIdIndex);
      const imageUrls = urlIndex < 0
        ? workshop.imageUrls
        : workshop.imageUrls.filter((_, itemIndex) => itemIndex !== urlIndex);
      await prisma.workshop.update({ where: { id: workshop.id }, data: { imagePublicIds, imageUrls } });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Could not delete Cloudinary workshop image:", error);
    return Response.json({ error: "Could not complete image deletion." }, { status: 500 });
  }
}

/* eslint-disable camelcase */
import { clerkClient } from "@clerk/nextjs/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.action";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "WEBHOOK_SECRET not configured" },
      { status: 500 }
    );
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { error: "Missing Svix headers" },
      { status: 400 }
    );
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  const eventType = evt.type;

  try {
    // CREATE
    if (eventType === "user.created") {
      const {
        id,
        email_addresses,
        image_url,
        first_name,
        last_name,
        username,
      } = evt.data;

      if (!email_addresses?.[0]?.email_address) {
        return NextResponse.json(
          { error: "Missing email address" },
          { status: 400 }
        );
      }

      const user = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username:
          username ||
          `${first_name || ""}_${last_name || ""}`.toLowerCase() ||
          `user_${id.slice(0, 8)}`,
        firstName: first_name || "",
        lastName: last_name || "",
        photo: image_url || "",
      };

      const newUser = await createUser(user);

      if (newUser) {
        try {
          const clerk = await clerkClient(); // Await the function to get the client
          await clerk.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUser._id,
            },
          });
        } catch (metadataError) {
          console.error("Failed to update user metadata:", metadataError);
        }
      }

      return NextResponse.json({ message: "OK", user: newUser });
    }

    // UPDATE
    if (eventType === "user.updated") {
      const { id, image_url, first_name, last_name, username } = evt.data;

      if (!id) {
        return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
      }

      const user = {
        firstName: first_name || "",
        lastName: last_name || "",
        username: username || "",
        photo: image_url || "",
      };

      const updatedUser = await updateUser(id, user);
      return NextResponse.json({ message: "OK", user: updatedUser });
    }

    // DELETE
    if (eventType === "user.deleted") {
      const { id } = evt.data;

      if (!id) {
        return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
      }

      const deletedUser = await deleteUser(id);
      return NextResponse.json({ message: "OK", user: deletedUser });
    }

    return NextResponse.json(
      { message: "Unhandled event type" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import ActivityLog from "@/models/ActivityLog";

type Action = "created" | "updated" | "deleted" | "restored" | "purged";
type EntityType = "skill" | "project" | "profile";

/**
 * Records a user activity. Best-effort: any failure here is swallowed so it can
 * never break the main request it is attached to.
 */
export async function logActivity(
  userId: unknown,
  action: Action,
  entityType: EntityType,
  entityName = ""
) {
  try {
    await ActivityLog.create({ userId, action, entityType, entityName });
  } catch {
    // intentionally ignored — logging must never throw into the request path
  }
}
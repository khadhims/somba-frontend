function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (value && typeof value === "object") {
    return value as Record<string, unknown>;
  }
  return undefined;
}

export function resolveImageUrl(item: Record<string, unknown>): string {
  return pickString(
    item.image_url,
    item.imageUrl,
    item.thumbnail_url,
    item.thumbnail,
    item.media_url,
    item.image,
    item.image_path,
  );
}

export function resolveImageUrls(
  item: Record<string, unknown>,
  primary?: string,
): string[] {
  const candidates: string[] = [];
  const imageUrls = item.image_urls ?? item.imageUrls;
  if (Array.isArray(imageUrls)) {
    candidates.push(
      ...imageUrls
        .filter((url): url is string => typeof url === "string" && !!url.trim())
        .map((url) => url.trim()),
    );
  }

  const primaryUrl = primary || resolveImageUrl(item);
  if (primaryUrl) {
    candidates.unshift(primaryUrl);
  }

  return candidates.filter((url, index, self) => self.indexOf(url) === index);
}

export function resolveRecordingUrl(item: Record<string, unknown>): string {
  const recordingEvent = asRecord(item.recording_event);
  return pickString(
    item.recording_url,
    item.recordingUrl,
    recordingEvent?.recording_url,
    recordingEvent?.recordingUrl,
  );
}

export function mapActivityEventItem(item: any, siteUid = "") {
  const source = asRecord(item) ?? {};
  const imageUrl = resolveImageUrl(source);

  return {
    severity: "medium" as const,
    site_uid: siteUid || pickString(item?.site_uid, item?.siteUid),
    camera_uuid: pickString(item?.camera_uid, item?.camera_uuid, item?.cameraUuid),
    camera_name: pickString(item?.camera?.name, item?.camera_name, item?.cameraName),
    event_id: pickString(item?.event_id, item?.eventId, item?.id),
    event_name: pickString(
      item?.activity_type,
      item?.event_name,
      item?.camera?.activity,
    ),
    event_start: item?.event_start ?? "",
    event_end: item?.event_end ?? "",
    duration_minutes: item?.duration_minutes,
    total_minutes: item?.total_minutes,
    avg_seconds_with_detection: item?.avg_seconds_with_detection,
    status: item?.status || "active",
    image_url: imageUrl,
    image_urls: resolveImageUrls(source, imageUrl),
    recording_url: resolveRecordingUrl(source),
    activities: item?.activities || [],
  };
}

export function mapAlertItem(item: any) {
  const source = asRecord(item) ?? {};
  const imageUrl = resolveImageUrl(source);

  return {
    event_id:
      pickString(item?.alert_id, item?.event_id, item?.id) ||
      `alert-${Date.now()}-${Math.random()}`,
    camera_uuid: pickString(item?.camera_uid, item?.camera_uuid, item?.cameraUuid),
    camera_name:
      pickString(item?.camera?.name, item?.camera_name, item?.cameraName) ||
      "Unknown Camera",
    violation_name: item?.violation_name || "Unknown Violation",
    event_start: item?.detected_at || item?.event_start || "",
    event_end: item?.event_end || "",
    timestamp: item?.detected_at || item?.event_start || "",
    duration_minutes: item?.duration_minutes || 0,
    total_detections: item?.total_detections || 1,
    detected_objects: item?.detected_objects || [],
    status: item?.status || "notResolved",
    image_url: imageUrl,
    image_urls: resolveImageUrls(source, imageUrl),
    recording_url: resolveRecordingUrl(source),
    activities: item?.activities || [],
    comment: item?.comment ?? null,
  };
}

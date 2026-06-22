export interface PaginationMeta {
  page?: number;
  per_page?: number;
  total_items?: number;
  total_pages?: number;
  next_page?: number | null;
  prev_page?: number | null;
}

export function parsePaginatedResponse<T = unknown>(resp: unknown): {
  items: T[];
  pagination: PaginationMeta;
} {
  const envelope = (resp as { data?: unknown })?.data ?? resp;
  const body = (envelope as { data?: unknown })?.data;

  if (
    body &&
    typeof body === "object" &&
    Array.isArray((body as { data?: unknown }).data)
  ) {
    const paginated = body as { data: T[]; pagination?: PaginationMeta };
    return {
      items: paginated.data,
      pagination: paginated.pagination ?? {},
    };
  }

  if (Array.isArray(body)) {
    return { items: body as T[], pagination: {} };
  }

  if (Array.isArray((envelope as { data?: unknown }).data)) {
    const legacy = envelope as { data: T[]; pagination?: PaginationMeta };
    return {
      items: legacy.data,
      pagination: legacy.pagination ?? {},
    };
  }

  return { items: [], pagination: {} };
}

export function applyPaginationMeta(
  pagination: PaginationMeta,
  targets: {
    totalItems: { value: number };
    totalPages: { value: number };
    page?: { value: number };
    perPage?: { value: number };
  },
) {
  if (typeof pagination.total_items === "number") {
    targets.totalItems.value = pagination.total_items;
  } else {
    targets.totalItems.value = 0;
  }

  if (typeof pagination.total_pages === "number") {
    targets.totalPages.value = pagination.total_pages;
  } else if (targets.perPage) {
    targets.totalPages.value = Math.max(
      1,
      Math.ceil(targets.totalItems.value / (targets.perPage.value || 1)),
    );
  }

  if (targets.page && typeof pagination.page === "number") {
    targets.page.value = pagination.page;
  }
}

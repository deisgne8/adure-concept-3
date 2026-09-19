const spacingTokenPattern = /^(pt|pb|mt|mb)_(0|25|50|75|100|125|150)$/;

type CmsSpacing = Record<string, unknown> | undefined;

export function getSpacingClassName(spacing: CmsSpacing) {
  if (!spacing) {
    return "";
  }

  return Object.values(spacing)
    .filter(
      (value): value is string =>
        typeof value === "string" && spacingTokenPattern.test(value),
    )
    .join(" ");
}

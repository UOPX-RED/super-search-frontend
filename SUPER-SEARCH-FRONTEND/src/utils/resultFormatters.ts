export function escapeCSV(str: string) {
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function getCourseName(originalText: string) {
  if (!originalText) return "Unknown Course";

  const splitted = originalText.split("This course");
  if (splitted.length > 1) {
    const courseName = splitted[0].trim();
    return courseName.length > 100 ? courseName.slice(0, 100) + "..." : courseName;
  }
  return originalText.slice(0, 40) + "...";
}

export function getSourceName(originalText: string) {
  if (!originalText) return "Unknown Source";
  
  if (originalText.includes("\n\n")) {
    const firstPart = originalText.split("\n\n")[0];
    return firstPart || "Unknown Program";
  }
  
  const splitted = originalText.split("This course");
  if (splitted.length > 1) {
    const courseName = splitted[0].trim();
    return courseName.length > 100 ? courseName.slice(0, 100) + "..." : courseName;
  }
  
  return originalText.slice(0, 40) + "...";
}

export function getProgramName(originalText: string) {
  if (!originalText) return "Unknown Program";
  
  const parts = originalText.split("\n\n");
  if (parts.length > 0) {
    return parts[0];
  }
  
  return originalText.slice(0, 40) + "...";
}
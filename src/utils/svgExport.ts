/**
 * Extracts SVG data from a DOM element and returns it as a string.
 * 
 * @param selector - CSS selector for the SVG element
 * @param prettyName - The icon's display name
 * @param weight - The current weight (regular, bold, fill)
 * @param duotone - Whether duotone is enabled
 * @returns The SVG as a string, or empty string if not found
 */
export function getSVGData(
  selector: string,
  prettyName: string,
  weight: string,
  duotone: boolean
): string {
  const svgElement = document.querySelector(selector);
  if (svgElement) {
    // Clone the element to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true) as SVGElement;
    // Create label from weight and duotone
    const weightLabel = weight.charAt(0).toUpperCase() + weight.slice(1);
    const variantLabel = duotone ? `${weightLabel}-Duotone` : weightLabel;
    // Add id attribute with format: {prettyName}-{Variant}
    clonedSvg.setAttribute('id', `${prettyName}-${variantLabel}`);
    return new XMLSerializer().serializeToString(clonedSvg);
  }
  return '';
}

/**
 * Downloads SVG data as a file.
 * 
 * @param svgData - The SVG string to download
 * @param filename - The filename for the download
 */
export function downloadSVG(svgData: string, filename: string): void {
  if (svgData) {
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Generates a filename for an SVG download.
 * 
 * @param iconName - The icon's name
 * @param weight - The current weight
 * @param duotone - Whether duotone is enabled
 * @returns The generated filename
 */
export function getSVGFilename(iconName: string, weight: string, duotone: boolean): string {
  return duotone
    ? `${iconName.toLowerCase()}-${weight}-duotone.svg`
    : `${iconName.toLowerCase()}-${weight}.svg`;
}

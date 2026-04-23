import type { ClientComponentInfo, ServerRegionInfo } from "../types";

export function clientComponentListEqual(
  a: ClientComponentInfo[],
  b: ClientComponentInfo[],
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    const ai = a[i];
    const bi = b[i];
    if (ai === undefined || bi === undefined) {
      return false;
    }
    if (ai.name !== bi.name) {
      return false;
    }
    const na = ai.domNodes;
    const nb = bi.domNodes;
    if (na.length !== nb.length) {
      return false;
    }
    for (let j = 0; j < na.length; j++) {
      const naJ = na[j];
      const nbJ = nb[j];
      if (naJ !== nbJ) {
        return false;
      }
    }
  }
  return true;
}

export function serverRegionsEqual(
  a: ServerRegionInfo[],
  b: ServerRegionInfo[],
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    const ai = a[i];
    const bi = b[i];
    if (ai === undefined || bi === undefined) {
      return false;
    }
    if (ai.element !== bi.element) {
      return false;
    }
    if (ai.source !== bi.source) {
      return false;
    }
    if (ai.displayLabel !== bi.displayLabel) {
      return false;
    }
  }
  return true;
}

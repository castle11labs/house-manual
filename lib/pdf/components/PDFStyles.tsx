import { StyleSheet } from "@react-pdf/renderer";
import type { PDFTheme } from "../themes";
import { styleConfigs, colorConfigs, defaultTheme } from "../themes";

export function createStyles(theme: PDFTheme = defaultTheme) {
  const style = styleConfigs[theme.style];
  const color = colorConfigs[theme.color];

  return StyleSheet.create({
    // --- Pages ---
    page: {
      paddingTop: 60,
      paddingBottom: 60,
      paddingHorizontal: 56,
      fontFamily: style.bodyFont,
      fontSize: 10,
      color: "#0E1012",
      backgroundColor: "#FFFFFF",
    },

    // --- Cover (always white bg, ink-friendly) ---
    coverPage: {
      paddingHorizontal: 56,
      fontFamily: style.coverFont,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
    },
    coverAccentBar: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: style.coverAccentBar ? 6 : 0,
      backgroundColor: color.accent,
    },
    coverBadge: {
      fontSize: 10,
      fontFamily: style.coverFontBold,
      color: color.accent,
      letterSpacing: 3,
      textTransform: "uppercase",
      marginBottom: 16,
      textAlign: style.coverCentered ? "center" : "left",
    },
    coverTitle: {
      fontSize: style.coverTitleSize,
      fontFamily: style.coverFontBold,
      lineHeight: 1.15,
      marginBottom: 12,
      color: "#0E1012",
      textAlign: style.coverCentered ? "center" : "left",
    },
    coverAddress: {
      fontSize: 18,
      fontFamily: style.coverFont,
      marginBottom: 4,
      color: "#0E1012",
      textAlign: style.coverCentered ? "center" : "left",
    },
    coverCityState: {
      fontSize: 14,
      color: "#6B7280",
      marginBottom: 32,
      textAlign: style.coverCentered ? "center" : "left",
    },
    coverMeta: {
      fontSize: 10,
      color: "#6B7280",
      marginBottom: 3,
      textAlign: style.coverCentered ? "center" : "left",
    },
    coverDivider: {
      width: style.coverCentered ? 64 : 48,
      borderBottomWidth: 2,
      borderBottomColor: color.accent,
      marginBottom: 16,
      ...(style.coverCentered ? { alignSelf: "center" as const } : {}),
    },
    coverFooter: {
      position: "absolute",
      bottom: 40,
      left: 56,
      right: 56,
      fontSize: 8,
      color: "#9CA3AF",
      textAlign: style.coverCentered ? "center" : "left",
    },

    // --- TOC ---
    tocTitle: {
      fontSize: 22,
      fontFamily: style.bodyFontBold,
      marginBottom: 24,
      color: "#0E1012",
    },
    tocEntry: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#E3E6E8",
    },
    tocNumber: {
      fontSize: 10,
      fontFamily: style.bodyFontBold,
      color: color.accent,
      width: 24,
    },
    tocLabel: {
      fontSize: 11,
      color: "#0E1012",
      flex: 1,
    },

    // --- Sections ---
    sectionTitle: {
      fontSize: style.sectionTitleSize,
      fontFamily: style.bodyFontBold,
      marginBottom: 20,
      color: "#0E1012",
      paddingBottom: 10,
      borderBottomWidth: 2,
      borderBottomColor: color.accent,
    },
    subsectionTitle: {
      fontSize: 11,
      fontFamily: style.bodyFontBold,
      marginBottom: 8,
      marginTop: 16,
      color: "#0E1012",
      paddingBottom: 4,
      borderBottomWidth: 1,
      borderBottomColor: "#E3E6E8",
    },

    // --- Data Rows ---
    row: {
      flexDirection: "row",
      marginBottom: 0,
      paddingVertical: 5,
      paddingHorizontal: 8,
    },
    rowStriped: {
      flexDirection: "row",
      marginBottom: 0,
      paddingVertical: 5,
      paddingHorizontal: 8,
      backgroundColor: color.accentLight,
    },
    label: {
      width: "38%",
      fontSize: 9,
      fontFamily: style.bodyFontBold,
      color: "#4B5E5E",
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
    value: {
      width: "62%",
      fontSize: 10,
      color: "#0E1012",
    },
    paragraph: {
      fontSize: 10,
      color: "#0E1012",
      lineHeight: 1.6,
      marginBottom: 8,
      paddingHorizontal: 8,
    },

    // --- Cards ---
    card: {
      borderWidth: 1,
      borderColor: "#E3E6E8",
      borderRadius: style.borderRadius,
      marginBottom: 12,
      overflow: "hidden",
    },
    cardHeader: {
      backgroundColor: color.accentLight,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#E3E6E8",
    },
    cardHeaderText: {
      fontSize: 10,
      fontFamily: style.bodyFontBold,
      color: "#0E1012",
    },
    cardBody: {
      paddingVertical: 4,
    },

    // --- Misc ---
    photo: {
      maxWidth: 280,
      maxHeight: 200,
      marginVertical: 8,
      marginHorizontal: 8,
      borderRadius: style.borderRadius > 4 ? 4 : style.borderRadius,
    },
    footer: {
      position: "absolute",
      bottom: 28,
      left: 56,
      right: 56,
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: 8,
      color: "#9CA3AF",
      borderTopWidth: 1,
      borderTopColor: "#E3E6E8",
      paddingTop: 8,
    },
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: "#E3E6E8",
      marginVertical: 12,
    },
    bullet: {
      flexDirection: "row",
      marginBottom: 4,
      paddingHorizontal: 8,
    },
    bulletDot: {
      width: 16,
      fontSize: 10,
      color: color.accent,
    },
    bulletText: {
      flex: 1,
      fontSize: 10,
      color: "#0E1012",
      lineHeight: 1.5,
    },
  });
}

export const styles = createStyles(defaultTheme);

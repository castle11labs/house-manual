import { StyleSheet } from "@react-pdf/renderer";
import type { PDFTheme } from "../themes";
import { styleConfigs, colorConfigs, defaultTheme } from "../themes";

export function createStyles(theme: PDFTheme = defaultTheme) {
  const style = styleConfigs[theme.style];
  const color = colorConfigs[theme.color];

  const isLightCover = style.coverLayout === "light";
  const isAccentCover = style.coverLayout === "accent";

  const coverBg = isAccentCover ? color.accent : isLightCover ? "#FFFFFF" : color.coverBg;
  const coverTextColor = isLightCover ? "#0E1012" : color.coverText;
  const coverMutedColor = isLightCover ? "#6B7280" : color.coverMuted;
  const coverAccentColor = isLightCover ? color.accent : isAccentCover ? "#FFFFFF" : color.accent;
  const coverDividerColor = isLightCover ? color.accent : isAccentCover ? "rgba(255,255,255,0.3)" : color.accent;

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
    coverPage: {
      paddingHorizontal: 56,
      fontFamily: style.coverFont,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      backgroundColor: coverBg,
    },
    coverBadge: {
      fontSize: 10,
      fontFamily: style.coverFontBold,
      color: coverAccentColor,
      letterSpacing: 3,
      textTransform: "uppercase",
      marginBottom: 16,
    },
    coverTitle: {
      fontSize: style.coverTitleSize,
      fontFamily: style.coverFontBold,
      lineHeight: 1.15,
      marginBottom: 12,
      color: coverTextColor,
    },
    coverAddress: {
      fontSize: 18,
      fontFamily: style.coverFont,
      marginBottom: 4,
      color: coverTextColor,
    },
    coverCityState: {
      fontSize: 14,
      color: coverMutedColor,
      marginBottom: 32,
    },
    coverMeta: {
      fontSize: 10,
      color: coverMutedColor,
      marginBottom: 3,
    },
    coverDivider: {
      width: 48,
      borderBottomWidth: 2,
      borderBottomColor: coverDividerColor,
      marginBottom: 16,
    },
    coverFooter: {
      position: "absolute",
      bottom: 40,
      left: 56,
      fontSize: 8,
      color: coverMutedColor,
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
      color: "#8B9CAC",
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

// Backward compat — default export
export const styles = createStyles(defaultTheme);

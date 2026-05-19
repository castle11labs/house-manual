import { StyleSheet } from "@react-pdf/renderer";

const COLORS = {
  primary: "#0E1012",
  secondary: "#4B5E5E",
  muted: "#8B9CAC",
  accent: "#007AFC",
  border: "#E3E6E8",
  bgLight: "#F7F8FA",
  white: "#FFFFFF",
};

export const styles = StyleSheet.create({
  // --- Pages ---
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 56,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  coverPage: {
    paddingHorizontal: 56,
    fontFamily: "Helvetica",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },
  coverBadge: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.accent,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  coverTitle: {
    fontSize: 40,
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.15,
    marginBottom: 12,
    color: COLORS.white,
  },
  coverAddress: {
    fontSize: 18,
    fontFamily: "Helvetica",
    marginBottom: 4,
    color: COLORS.white,
  },
  coverCityState: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 32,
  },
  coverMeta: {
    fontSize: 10,
    color: COLORS.muted,
    marginBottom: 3,
  },
  coverDivider: {
    width: 48,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
    marginBottom: 16,
  },
  coverFooter: {
    position: "absolute",
    bottom: 40,
    left: 56,
    fontSize: 8,
    color: COLORS.muted,
  },

  // --- TOC ---
  tocTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    marginBottom: 24,
    color: COLORS.primary,
  },
  tocEntry: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tocNumber: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.accent,
    width: 24,
  },
  tocLabel: {
    fontSize: 11,
    color: COLORS.primary,
    flex: 1,
  },

  // --- Sections ---
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 20,
    color: COLORS.primary,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
  },
  subsectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    marginTop: 16,
    color: COLORS.primary,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    backgroundColor: COLORS.bgLight,
  },
  label: {
    width: "38%",
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: COLORS.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  value: {
    width: "62%",
    fontSize: 10,
    color: COLORS.primary,
  },
  paragraph: {
    fontSize: 10,
    color: COLORS.primary,
    lineHeight: 1.6,
    marginBottom: 8,
    paddingHorizontal: 8,
  },

  // --- Cards ---
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardHeader: {
    backgroundColor: COLORS.bgLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardHeaderText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
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
    borderRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: COLORS.muted,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    color: COLORS.accent,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.primary,
    lineHeight: 1.5,
  },
});

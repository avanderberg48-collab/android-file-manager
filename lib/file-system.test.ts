import { describe, it, expect } from "vitest";
import {
  getFileType,
  formatFileSize,
  formatDate,
} from "./file-system";

describe("File System Utilities", () => {
  describe("getFileType", () => {
    it("should identify image files", () => {
      expect(getFileType("photo.jpg")).toBe("image");
      expect(getFileType("picture.png")).toBe("image");
      expect(getFileType("graphic.webp")).toBe("image");
    });

    it("should identify video files", () => {
      expect(getFileType("movie.mp4")).toBe("video");
      expect(getFileType("clip.mov")).toBe("video");
      expect(getFileType("video.avi")).toBe("video");
    });

    it("should identify audio files", () => {
      expect(getFileType("song.mp3")).toBe("audio");
      expect(getFileType("track.wav")).toBe("audio");
      expect(getFileType("audio.m4a")).toBe("audio");
    });

    it("should identify document files", () => {
      expect(getFileType("report.pdf")).toBe("document");
      expect(getFileType("notes.txt")).toBe("document");
      expect(getFileType("sheet.xlsx")).toBe("document");
    });

    it("should identify archive files", () => {
      expect(getFileType("backup.zip")).toBe("archive");
      expect(getFileType("compressed.rar")).toBe("archive");
      expect(getFileType("package.tar")).toBe("archive");
    });

    it("should return other for unknown types", () => {
      expect(getFileType("unknown.xyz")).toBe("other");
      expect(getFileType("file")).toBe("other");
    });

    it("should be case insensitive", () => {
      expect(getFileType("PHOTO.JPG")).toBe("image");
      expect(getFileType("Movie.MP4")).toBe("video");
    });
  });

  describe("formatFileSize", () => {
    it("should format bytes correctly", () => {
      expect(formatFileSize(0)).toBe("0 B");
      expect(formatFileSize(500)).toBe("500.00 B");
      expect(formatFileSize(1023)).toBe("1023.00 B");
    });

    it("should format kilobytes correctly", () => {
      expect(formatFileSize(1024)).toBe("1.00 KB");
      expect(formatFileSize(1536)).toBe("1.50 KB");
      expect(formatFileSize(10240)).toBe("10.00 KB");
    });

    it("should format megabytes correctly", () => {
      expect(formatFileSize(1048576)).toBe("1.00 MB");
      expect(formatFileSize(5242880)).toBe("5.00 MB");
    });

    it("should format gigabytes correctly", () => {
      expect(formatFileSize(1073741824)).toBe("1.00 GB");
      expect(formatFileSize(2147483648)).toBe("2.00 GB");
    });
  });

  describe("formatDate", () => {
    it("should format recent times correctly", () => {
      const now = Date.now();
      const fiveSecondsAgo = Math.floor((now - 5000) / 1000);
      expect(formatDate(fiveSecondsAgo)).toBe("Just now");
    });

    it("should format minutes ago", () => {
      const now = Date.now();
      const fiveMinutesAgo = Math.floor((now - 5 * 60 * 1000) / 1000);
      expect(formatDate(fiveMinutesAgo)).toBe("5 minutes ago");
    });

    it("should format hours ago", () => {
      const now = Date.now();
      const twoHoursAgo = Math.floor((now - 2 * 60 * 60 * 1000) / 1000);
      expect(formatDate(twoHoursAgo)).toBe("2 hours ago");
    });

    it("should format days ago", () => {
      const now = Date.now();
      const threeDaysAgo = Math.floor((now - 3 * 24 * 60 * 60 * 1000) / 1000);
      expect(formatDate(threeDaysAgo)).toBe("3 days ago");
    });

    it("should format old dates as date string", () => {
      const now = Date.now();
      const tenDaysAgo = Math.floor((now - 10 * 24 * 60 * 60 * 1000) / 1000);
      const result = formatDate(tenDaysAgo);
      // Should be a date string, not relative time
      expect(result).not.toContain("ago");
      expect(result).toMatch(/\d+\/\d+\/\d+/);
    });
  });
});

import { describe, expect, it } from "vitest";

import {
  getRolePermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
} from "@/lib/permissions";

describe("permissions (RBAC espelhado do backend)", () => {
  describe("hasPermission", () => {
    it("concede analytics:view para ADMIN e nega para AGENT", () => {
      expect(hasPermission("ADMIN", "analytics:view")).toBe(true);
      expect(hasPermission("AGENT", "analytics:view")).toBe(false);
    });

    it("restringe users:list a ADMIN", () => {
      expect(hasPermission("ADMIN", "users:list")).toBe(true);
      expect(hasPermission("SUPERVISOR", "users:list")).toBe(false);
    });

    it("permite tickets:view para CUSTOMER e OMBUDSMAN", () => {
      expect(hasPermission("CUSTOMER", "tickets:view")).toBe(true);
      expect(hasPermission("OMBUDSMAN", "tickets:view")).toBe(true);
    });

    it("comentários internos: equipe pode, cliente não", () => {
      expect(hasPermission("AGENT", "comments:view")).toBe(true);
      expect(hasPermission("SUPERVISOR", "comments:create")).toBe(true);
      expect(hasPermission("CUSTOMER", "comments:view")).toBe(false);
      expect(hasPermission("OMBUDSMAN", "comments:create")).toBe(false);
    });

    it("nega tudo quando não há role", () => {
      expect(hasPermission(null, "tickets:view")).toBe(false);
      expect(hasPermission(undefined, "dashboard:view")).toBe(false);
    });
  });

  describe("hasAnyPermission / hasAllPermissions", () => {
    it("any: AGENT tem ao menos uma das permissões", () => {
      expect(
        hasAnyPermission("AGENT", ["analytics:view", "tickets:view"]),
      ).toBe(true);
    });

    it("all: SUPERVISOR tem todas, AGENT não (assign)", () => {
      expect(
        hasAllPermissions("SUPERVISOR", ["tickets:view", "tickets:assign"]),
      ).toBe(true);
      expect(
        hasAllPermissions("AGENT", ["tickets:view", "tickets:assign"]),
      ).toBe(false);
    });
  });

  describe("getRolePermissions", () => {
    it("ADMIN inclui settings:access; AGENT não", () => {
      expect(getRolePermissions("ADMIN")).toContain("settings:access");
      expect(getRolePermissions("AGENT")).not.toContain("settings:access");
    });

    it("role ausente retorna lista vazia", () => {
      expect(getRolePermissions(null)).toEqual([]);
    });
  });
});

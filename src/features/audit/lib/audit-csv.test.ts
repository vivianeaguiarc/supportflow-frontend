import { describe, expect, it } from "vitest";

import type { AuditLogEntry } from "../types";
import { buildAuditCsv } from "./audit-csv";

function makeEntry(overrides: Partial<AuditLogEntry> = {}): AuditLogEntry {
  return {
    id: "log-1",
    sequence: "10",
    organizationId: "org-1",
    userId: "user-1",
    action: "ticket.status_changed",
    entity: "ticket",
    entityId: "tkt-1",
    ip: "203.0.113.7",
    requestId: "req-abc",
    oldValues: null,
    newValues: null,
    metadata: null,
    previousHash: "prev",
    hash: "hash",
    createdAt: "2026-06-25T12:00:00.000Z",
    ...overrides,
  };
}

describe("buildAuditCsv", () => {
  it("inclui o cabeçalho e uma linha por registro", () => {
    const csv = buildAuditCsv([makeEntry()]);
    const lines = csv.split("\r\n");

    expect(lines[0]).toContain("sequence");
    expect(lines[0]).toContain("ip");
    expect(lines[0]).toContain("requestId");
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain("203.0.113.7");
    expect(lines[1]).toContain("req-abc");
    expect(lines[1]).toContain("ticket.status_changed");
  });

  it("escapa vírgulas e aspas conforme RFC 4180", () => {
    const csv = buildAuditCsv([
      makeEntry({ action: 'weird,"value', ip: null, requestId: null }),
    ]);
    const dataLine = csv.split("\r\n")[1];

    // Campo com vírgula/aspas precisa vir entre aspas, com aspas duplicadas.
    expect(dataLine).toContain('"weird,""value"');
    // Valores nulos viram string vazia (dois campos vazios consecutivos).
    expect(dataLine).toContain(",,");
  });

  it("representa valores nulos como vazio", () => {
    const csv = buildAuditCsv([
      makeEntry({ entityId: null, userId: null, organizationId: null }),
    ]);
    expect(csv.split("\r\n")).toHaveLength(2);
  });
});

import assert from "node:assert/strict";
import test from "node:test";
import { trialUnavailableReason } from "../lib/trial-booking.ts";

const available = { group_id: "group", status: "scheduled", free_places: 1 };

test("a scheduled group lesson with a free place can be booked", () => {
  assert.equal(trialUnavailableReason(available), "");
});

test("a full lesson explains why booking is unavailable", () => {
  assert.match(trialUnavailableReason({ ...available, free_places: 0 }), /Свободных мест нет/);
});

test("a completed or cancelled lesson cannot be booked", () => {
  for (const status of ["completed", "cancelled"]) {
    assert.match(trialUnavailableReason({ ...available, status }), /только на запланированное/);
  }
});

test("a lesson without a group cannot be booked as a trial", () => {
  assert.match(trialUnavailableReason({ ...available, group_id: null }), /учебной группы/);
});

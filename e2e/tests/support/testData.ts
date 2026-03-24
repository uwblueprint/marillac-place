export const testData = {
  participantPid: Number(process.env.E2E_PARTICIPANT_PID ?? "1"),
  participantPassword: process.env.E2E_PARTICIPANT_PASSWORD ?? "test123",
  adminPassword: process.env.E2E_ADMIN_PASSWORD ?? "abc123",
  reliefPassword: process.env.E2E_RELIEF_PASSWORD ?? "test123",
};

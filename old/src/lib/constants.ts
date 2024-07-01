export const Permission = {
  Read: "Read",
  Write: "Write",
  Admin: "Admin",
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];

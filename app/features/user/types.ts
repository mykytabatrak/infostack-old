import type { Link } from "../link/types";
import type { Page } from "../page/types";
import type { Skill } from "../skill/types";

export type User = {
  id: string;
  fullName: string;
  email: string;
  title?: string;
  skills?: Skill[];
  avatar: string;
  followingPages?: Page[];
  links?: Link[];
};

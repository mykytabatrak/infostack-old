import type { Permission } from "../../lib/constants";
import type { User } from "../user/types";

export type Page = {
  id: string;
  authorId: string;
  parentPageId?: string;
  childPages?: Page[];
  pageContents: PageContent[];
  permission?: Permission;
  followingUsers?: User[];
  pinnedUsers?: User[];
  draft?: PageDraft;
};

export type PageContent = {
  id: string;
  authorId: string;
  pageId: string;
  title: string;
  content?: string;
  createdAt: string;
  deletedAt?: string;
  updatedAt?: string;
};

export type PageDraft = {
  id: string;
  pageId: string;
  title?: string;
  content?: string;
};

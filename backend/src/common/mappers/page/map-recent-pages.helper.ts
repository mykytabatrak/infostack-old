import { IPageRecent } from '../../../common/interfaces/page';
import { RecentPage } from '../../../data/entities/recent-pages';

export const mapToRecentPage = (recentPages: RecentPage[]): IPageRecent[] => {
  const cutRecentPages: RecentPage[] = recentPages.slice(0, 5);

  const mappedRecentPages = cutRecentPages.map(
    ({ pageId, createdAt, page }) => ({
      visited: createdAt.toLocaleString(),
      pageId,
      title: page.pageContents.sort((a, b) =>
        b.updatedAt > a.updatedAt ? 1 : -1,
      )[0].title,
    }),
  );

  return mappedRecentPages;
};
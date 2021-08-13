import ReactMarkdown from 'react-markdown';
import { Card, Col, Row } from 'react-bootstrap';
import isUUID from 'is-uuid';
import {
  useAppDispatch,
  useAppSelector,
  useEffect,
  useState,
  useParams,
  useHistory,
} from 'hooks/hooks';
import { RootState } from 'common/types/types';
import { AppRoute } from 'common/enums/enums';
import { pagesActions } from 'store/pages';
import { CommentSection } from '../comment-section/comment-section';
import { Spinner } from 'components/common/spinner/spinner';
import styles from './styles.module.scss';
import PageContributors from '../page-contributors/page-contributors';
import { PageApi } from 'services';
import {
  IPageContributor,
  IPageTableOfContentsHeading,
} from 'common/interfaces/pages';
import EditButton from '../edit-button/edit-button';
import { replaceIdParam } from 'helpers/helpers';
import PageTableOfContents from '../page-table-of-contents.tsx/page-table-of-contents';
import slug from 'remark-slug';

const PageContent: React.FC = () => {
  const { isSpinner } = useAppSelector((state: RootState) => state.pages);
  const { currentPage } = useAppSelector((state: RootState) => state.pages);
  const pageTitle = currentPage?.pageContents[0].title;
  const content = currentPage?.pageContents[0].content;

  const history = useHistory();
  const dispatch = useAppDispatch();
  const paramsId = useParams<{ id: string }>().id;

  const [isLeftBlockLoading, setIsLeftBlockLoading] = useState(false);

  const [contributors, setContributors] = useState<IPageContributor[]>([]);
  const [TOCHeadings, setTOCHeadings] = useState<IPageTableOfContentsHeading[]>(
    [],
  );

  const getPageById = async (id?: string): Promise<void> => {
    const payload: string | undefined = id;
    await dispatch(pagesActions.getPage(payload));
  };

  useEffect(() => {
    if (paramsId && isUUID.anyNonNil(paramsId)) {
      setIsLeftBlockLoading(true);

      getPageById(paramsId);

      const contributorsPromise = new PageApi().getPageContributors(paramsId);
      const TOCPromise = new PageApi().getPageTableOfContents(paramsId);

      Promise.all([contributorsPromise, TOCPromise]).then(
        ([contributors, TOC]) => {
          setContributors(contributors);
          setTOCHeadings(TOC.headings);
        },
      );

      setIsLeftBlockLoading(false);
    } else {
      dispatch(pagesActions.clearCurrentPage());
      history.push(AppRoute.ROOT);
    }
  }, [paramsId]);

  const handleEditing = (): void => {
    history.push(replaceIdParam(AppRoute.CONTENT_SETTING, paramsId || ''));
  };

  const Content: React.FC = () => {
    return (
      <div className="p-4">
        <Row>
          <Col xs={2}>
            <PageTableOfContents headings={TOCHeadings} />

            <PageContributors className="mt-4" contributors={contributors} />
          </Col>
          <Col>
            <Row>
              <Col className="d-flex justify-content-between mb-4">
                <h1 className="h3 mb-3">{pageTitle || 'New Page'}</h1>
                <EditButton onClick={handleEditing} />
              </Col>
            </Row>
            <Row className="mb-4">
              <Col>
                <Card border="light" className={styles.card}>
                  <Card.Body>
                    {/* @ts-expect-error see https://github.com/rehypejs/rehype/discussions/63 */}
                    <ReactMarkdown remarkPlugins={[slug]}>
                      {content || 'Empty page'}
                    </ReactMarkdown>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card border="light" className={styles.card}>
                  <Card.Header>Comments</Card.Header>
                  <Card.Body>
                    <CommentSection pageId={paramsId} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  };

  return !isSpinner && !isLeftBlockLoading ? <Content /> : <Spinner />;
};

export default PageContent;

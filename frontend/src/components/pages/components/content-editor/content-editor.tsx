import 'react-markdown-editor-lite/lib/index.css';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import Editor from 'react-markdown-editor-lite';
import ReactMarkdown from 'react-markdown';
import { useHistory } from 'react-router';
import { RootState } from 'common/types/types';
import { AppRoute } from 'common/enums/enums';
import { pagesActions } from 'store/pages';
import {
  useState,
  useAppDispatch,
  useAppSelector,
  useParams,
  useRef,
} from 'hooks/hooks';

const PageContentEditor: React.FC = () => {
  const { currentPage } = useAppSelector((state: RootState) => state.pages);
  const pageTitle = currentPage?.pageContents[0].title;
  const content = currentPage?.pageContents[0].content;
  const paramsId = useParams<{ id: string }>().id;

  const history = useHistory();
  const dispatch = useAppDispatch();
  const editorRef = useRef(null);

  const [titleInputValue, setTitleInputValue] = useState(pageTitle);
  const [markDownContent, setMarkDownContent] = useState(content);

  const onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    setTitleInputValue(target.value);
  };

  const handleSaveConfirm = (): void => {
    if (titleInputValue || markDownContent) {
      dispatch(pagesActions.editPageContent({
        pageId: paramsId,
        title: titleInputValue,
        content: markDownContent,
      }));
    }
    history.push(AppRoute.PAGE.replace(':id', paramsId));
  };

  return (
    <div className="content">
      <div className="container-fluid p-0">
        <div className="d-flex justify-content-between mb-4">
          <InputGroup>
            <FormControl
              value={titleInputValue}
              onChange={onInputChange}
            />
          </InputGroup>
        </div>
        <Editor
          value={markDownContent}
          onChange={({ text }): void => setMarkDownContent(text)}
          renderHTML={(text): JSX.Element => <ReactMarkdown>{text}</ReactMarkdown>}
          ref={editorRef}
        />
      </div>
      <Button className="mt-4" onClick={handleSaveConfirm}>
        Save
      </Button>
    </div>
  );
};

export default PageContentEditor;

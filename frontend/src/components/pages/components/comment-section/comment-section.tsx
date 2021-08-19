import { Card } from 'react-bootstrap';
import {
  useAppDispatch,
  useAppSelector,
  useContext,
  useEffect,
  useState,
} from 'hooks/hooks';
import { SocketContext } from 'context/socket';
import { commentsActions } from 'store/actions';
import { IComment } from 'common/interfaces/comment';
import { SocketEvents } from 'common/enums/enums';
import { CommentForm } from '../components';

import styles from './styles.module.scss';
import { getAllowedClasses } from 'helpers/helpers';
import { CommentList } from '../comment-list/comment-list';
import { DeleteModal } from '../delete-modal/delete-modal';
import { toast } from 'react-toastify';

type Props = {
  pageId: string;
};

export const CommentSection: React.FC<Props> = ({ pageId }) => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalDisabled, setIsModalDisabled] = useState<boolean>(false);
  const [commentToDelete, setCommentToDelete] = useState<string | undefined>(
    undefined,
  );

  const onComment = (comment: IComment): void => {
    if (comment.author.id !== user?.id) {
      dispatch(commentsActions.addComment(comment));
    }
  };

  const handleDelete = (id: string): void => {
    setCommentToDelete(id);
    setIsModalVisible(true);
  };

  const modalHandler = async (isConfirmed: boolean): Promise<void> => {
    try {
      setIsModalDisabled(true);
      if (isConfirmed && commentToDelete) {
        await dispatch(
          commentsActions.deleteComment({ id: commentToDelete, pageId }),
        ).unwrap();
      }
      setCommentToDelete(undefined);
      setIsModalVisible(false);
    } catch {
      toast.error('Could not delete comment');
    } finally {
      setIsModalDisabled(false);
    }
  };

  useEffect(() => {
    dispatch(commentsActions.fetchComments(pageId));
    socket.emit(SocketEvents.PAGE_JOIN, pageId);
    socket.on(SocketEvents.PAGE_NEW_COMMENT, onComment);

    return (): void => {
      socket.off(SocketEvents.PAGE_NEW_COMMENT, onComment);
    };
  }, []);

  return (
    <>
      <Card border="light" className={styles.card}>
        <Card.Header className={getAllowedClasses('bg-white', styles.header)}>
          Comments
        </Card.Header>
        <Card.Body>
          <CommentForm
            pageId={pageId}
            className="m-0"
            placeholder="Add a comment"
          />
          <CommentList pageId={pageId} handleDelete={handleDelete} />
        </Card.Body>
      </Card>
      <DeleteModal
        show={isModalVisible}
        handler={modalHandler}
        isDisabled={isModalDisabled}
      />
    </>
  );
};

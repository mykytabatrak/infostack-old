import { Form, Button } from 'react-bootstrap';
import { useState, useAppSelector, useAppDispatch } from 'hooks/hooks';
import { RequestStatus } from 'common/enums/enums';
import { UserAvatar } from 'components/common/common';
import { getAllowedClasses } from 'helpers/helpers';
import { commentsActions } from 'store/comments';
import styles from './styles.module.scss';
import { toast } from 'react-toastify';

type Props = {
  pageId: string;
  parentCommentId?: string;
  className?: string;
  placeholder?: string;
  onSubmit?: () => void;
};

export const CommentForm: React.FC<Props> = ({
  pageId,
  parentCommentId,
  className,
  placeholder,
  onSubmit,
}) => {
  const [text, setText] = useState('');
  const user = useAppSelector((state) => state.auth.user);
  const { createStatus, fetchStatus, deleteStatus } = useAppSelector(
    (state) => state.comments,
  );
  const dispatch = useAppDispatch();

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>): void => setText(value);

  const handleSubmit = async (): Promise<void> => {
    try {
      await dispatch(
        commentsActions.createComment({
          pageId,
          payload: { text, parentCommentId },
        }),
      ).unwrap();
      setText('');
      onSubmit?.();
    } catch {
      toast.error('Could not add comment');
    }
  };

  const isSubmitDisabled =
    createStatus === RequestStatus.LOADING ||
    fetchStatus === RequestStatus.LOADING ||
    deleteStatus === RequestStatus.LOADING;
  const isCancelDisabled = createStatus === RequestStatus.LOADING;
  const isFieldDisabled = isCancelDisabled;

  return (
    <>
      <Form className={className}>
        <Form.Group>
          <div className="d-flex align-items-start">
            <UserAvatar
              size="40"
              name={user?.fullName}
              src={user?.avatar}
              round
              className={getAllowedClasses(styles.avatar)}
            />
            <div className="flex-grow-1 ms-3">
              <Form.Control
                disabled={isFieldDisabled}
                as="textarea"
                placeholder={placeholder}
                value={text}
                className={getAllowedClasses('mb-2', styles.text)}
                onChange={handleChange}
              />
              <Button
                disabled={isCancelDisabled}
                onClick={(): void => setText('')}
                className={styles.text}
                variant="warning"
              >
                Cancel
              </Button>
              <Button
                disabled={isSubmitDisabled || text.trim() === ''}
                onClick={handleSubmit}
                className={getAllowedClasses('ms-2', styles.text)}
                variant="success"
              >
                Submit
              </Button>
            </div>
          </div>
        </Form.Group>
      </Form>
    </>
  );
};

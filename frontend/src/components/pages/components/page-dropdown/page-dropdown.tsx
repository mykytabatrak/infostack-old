import { Dropdown, NavLink } from 'react-bootstrap';
import { useAppSelector } from 'hooks/hooks';
import { PermissionType } from 'common/enums/enums';
import { getAllowedClasses } from 'helpers/helpers';
import { RootState } from 'common/types/types';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  onAssign(): void;
  onEditing(): void;
  onPageFollow(): void;
  onDelete(): void;
  isCurrentPageFollowed: boolean;
}

export const PageActionsDropdown: React.FC<Props> = ({
  className,
  onAssign,
  onEditing,
  onPageFollow,
  onDelete,
  isCurrentPageFollowed,
}) => {
  const currentPage = useAppSelector(
    (state: RootState) => state.pages.currentPage,
  );

  const isPageAdmin = currentPage?.permission === PermissionType.ADMIN;
  const canEdit =
    currentPage?.permission === PermissionType.ADMIN ||
    currentPage?.permission === PermissionType.WRITE;

  return (
    <Dropdown
      className={getAllowedClasses(className, styles.dropdown)}
      bsPrefix="w-0"
    >
      <Dropdown.Toggle
        as={NavLink}
        className={getAllowedClasses(styles.dropdownButton)}
      >
        <i className="bi bi-three-dots"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {isPageAdmin && (
          <Dropdown.Item
            className={getAllowedClasses(styles.dropdownItem)}
            onClick={onAssign}
          >
            Assign permissions
          </Dropdown.Item>
        )}
        <Dropdown.Item
          className={getAllowedClasses(styles.dropdownItem)}
          onClick={onPageFollow}
        >
          {isCurrentPageFollowed ? 'Unfollow' : 'Follow'}
        </Dropdown.Item>
        {canEdit && (
          <>
            <Dropdown.Item
              className={getAllowedClasses(styles.dropdownItem)}
              onClick={onEditing}
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Item
              className={getAllowedClasses(styles.dropdownItem)}
              onClick={onDelete}
            >
              Delete
            </Dropdown.Item>
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};
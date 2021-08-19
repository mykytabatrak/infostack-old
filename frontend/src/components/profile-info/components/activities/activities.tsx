import { Button, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import {
  useAppDispatch,
  useAppSelector,
  useEffect,
  useHistory,
} from 'hooks/hooks';
import { activitiesActions } from 'store/activities';
import { IUserActivity } from 'common/interfaces/user';
import {
  getAllowedClasses,
  replaceIdParam,
  replacePageIdParamAndVersionId,
} from 'helpers/helpers';
import { FilterOption, FILTER_OPTIONS } from 'store/activities/slice';
import { UserAvatar } from 'components/common/common';
import { AppRoute } from 'common/enums/enums';
import styles from './styles.module.scss';

const Activities: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activities, filter, totalItems } = useAppSelector(
    (state) => state.activities,
  );

  useEffect(() => {
    dispatch(activitiesActions.fetchActivities());
  }, [filter]);

  const updateFilter = (filter: FilterOption): void => {
    dispatch(activitiesActions.updateFilter(filter));
  };

  const loadMore = (): void => {
    dispatch(activitiesActions.loadMoreActivities());
  };

  return (
    <div>
      <Card.Title
        className={getAllowedClasses(styles.title, 'profile-card-title')}
      >
        <span>Activities</span>

        <DropdownButton title={filter} id="activity-filter" size="sm">
          {FILTER_OPTIONS.map((option) => {
            return (
              <Dropdown.Item
                key={option}
                active={filter === option}
                onClick={(): void => updateFilter(option)}
              >
                {option}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>
      </Card.Title>

      <div className={styles.container}>
        {activities.map((activity) => {
          return <Activity key={activity.id} activity={activity} />;
        })}

        {totalItems > activities.length && (
          <Button className={styles.loadMore} onClick={loadMore}>
            Load more
          </Button>
        )}
      </div>
    </div>
  );
};

const Activity: React.FC<{ activity: IUserActivity }> = ({ activity }) => {
  const history = useHistory();
  const { id, user, page, type, isNew, createdAtTimestamp } = activity;

  const handleClick = (): void => {
    let path: string;

    if (type === 'comment') {
      path = replaceIdParam(AppRoute.PAGE, page.id);
    } else {
      path = replacePageIdParamAndVersionId(
        AppRoute.PAGE_PREVIOUS_VERSION,
        page.id,
        id,
      );
    }

    history.push(path);
  };

  const getMessage = (): string => {
    if (isNew && type === 'page') {
      return ' created a new page ';
    } else if (!isNew && type === 'page') {
      return ' updated the ';
    } else {
      return ' added a comment to the ';
    }
  };

  const getMessageEnding = (): string => {
    if (isNew && type === 'page') {
      return '.';
    } else {
      return ' page.';
    }
  };

  const getDate = (): string => {
    const today = new Date().getDate();
    const createdAt = new Date(createdAtTimestamp * 1000);
    const createdAtDay = createdAt.getDate();
    const createdAtHour = createdAt.getUTCHours();
    const createdAtMinutes = createdAt.getMinutes();

    switch (createdAtDay) {
      case today:
        return `Today ${createdAtHour}:${createdAtMinutes}`;
      case today - 1:
        return `Yesterday ${createdAtHour}:${createdAtMinutes}`;
      default: {
        const MONTH_NAMES = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        const month = createdAt.getMonth();

        return `${MONTH_NAMES[month]} ${createdAtDay}`;
      }
    }
  };

  return (
    <div className={styles.activity} onClick={handleClick}>
      <UserAvatar
        size="40"
        name={user.fullName}
        src={user.avatar}
        round={true}
      />

      <div className={styles.infoContainer}>
        <span className={styles.fullName}>
          <b>{user.fullName}</b>
          {getMessage()}
          <b>{page.title}</b>
          {getMessageEnding()}
        </span>
        <span className={styles.createdAt}>{getDate()}</span>

        {page.content && (
          <Card className={styles.contentContainer}>
            <Card.Body>
              <span className={styles.content}>{page.content}</span>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export { Activities };
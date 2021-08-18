import { getCustomRepository } from 'typeorm';
import { EntityType } from '../common/enums/entity-type';
import { INotification } from '../common/interfaces/notification';
import CommentRepository from '../data/repositories/comment.repository';
import NotificationRepository from '../data/repositories/notification.repository';
import PageRepository from '../data/repositories/page.repository';
import { mapNotificationToINotification } from '../common/mappers/notification/map-notification-to-inotification';
import { Notification } from '../data/entities/notification';

const setSubtitle = async (
  notification: Notification,
): Promise<INotification> => {
  const commentRepository = getCustomRepository(CommentRepository);
  const pageRepository = getCustomRepository(PageRepository);
  const comment = await commentRepository.findOneById(
    notification.entityTypeId,
  );
  const page = await pageRepository.findByIdWithLastContent(comment.pageId);
  return {
    ...mapNotificationToINotification(notification),
    subtitle: page.pageContents[0].title,
  };
};

export const getNotifications = async (
  userId: string,
  limit?: number,
  from?: number,
): Promise<INotification[]> => {
  const notificationRepository = getCustomRepository(NotificationRepository);
  const start = from || 0;
  const notifications = await notificationRepository.findSomeByUserId(
    userId,
    start,
    limit,
  );

  const commentNotifications = notifications.filter(
    (notification) => notification.type === EntityType.COMMENT,
  );
  if (!commentNotifications.length) {
    return notifications.map(mapNotificationToINotification);
  } else {
    const expandedNotifications = notifications
      .filter((notification) => notification.type !== 'comment')
      .map(mapNotificationToINotification);
    for (const notification of commentNotifications) {
      const expandedNotification = await setSubtitle(notification);
      expandedNotifications.push(expandedNotification);
    }
    return expandedNotifications;
  }
};

export const getNotificationsCount = async (
  userId: string,
): Promise<{ count: number }> => {
  const notificationRepository = getCustomRepository(NotificationRepository);
  const notifications = await notificationRepository.findAllByUserId(userId);
  const count = notifications.filter(
    (notification) => !notification.read,
  ).length;
  return { count };
};

export const updateRead = async (
  notificationId: string,
  body: { read: boolean },
): Promise<INotification> => {
  const notificationRepository = getCustomRepository(NotificationRepository);
  await notificationRepository.update({ id: notificationId }, body);
  const notification = await notificationRepository.findById(notificationId);
  if (notification.type === EntityType.COMMENT) {
    const expandedNotification = await setSubtitle(notification);
    return expandedNotification;
  } else {
    return mapNotificationToINotification(notification);
  }
};

export const updateReadForAll = async (
  userId: string,
  body: { read: boolean },
): Promise<INotification[]> => {
  const notificationRepository = getCustomRepository(NotificationRepository);
  const notifications = await notificationRepository.findAllByUserId(userId);
  for (const notification of notifications) {
    await notificationRepository.update({ id: notification.id }, body);
  }
  return await getNotifications(userId);
};
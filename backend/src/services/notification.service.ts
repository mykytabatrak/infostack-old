import { getCustomRepository } from 'typeorm';
// import { Server } from 'socket.io';
import { EntityType } from '../common/enums/entity-type';
import { INotification } from '../common/interfaces/notification';
import CommentRepository from '../data/repositories/comment.repository';
import NotificationRepository from '../data/repositories/notification.repository';
import PageRepository from '../data/repositories/page.repository';
import { mapNatoficationToINatofication } from '../common/mappers/notification/map-notification-to-inotification';
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
    ...mapNatoficationToINatofication(notification),
    subtitle: page.pageContents[0].title,
  };
};

export const getNotifications = async (
  userId: string,
  limit?: number,
): Promise<INotification[]> => {
  const notificationRepository = getCustomRepository(NotificationRepository);
  const notifications = limit
    ? await notificationRepository.findSomeByUserId(userId, limit)
    : await notificationRepository.findAllByUserId(userId);

  const commentNotifications = notifications.filter(
    (notification) => notification.type === EntityType.COMMENT,
  );
  if (!commentNotifications.length) {
    return notifications.map(mapNatoficationToINatofication);
  } else {
    const expandedNotifications = notifications
      .filter((notification) => notification.type !== 'comment')
      .map(mapNatoficationToINatofication);
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
    return mapNatoficationToINatofication(notification);
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

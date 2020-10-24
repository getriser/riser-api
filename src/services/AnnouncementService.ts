import {
  AnnouncementResponse,
  CreateAnnouncementParams,
  UpdateAnnouncementParams,
} from '../types';
import { getRepository } from 'typeorm';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';
import ForbiddenApiError from '../errors/ForbiddenApiError';
import Announcement from '../entity/Announcement';
import AbstractService from './AbstractService';
import BadRequestApiError from '../errors/BadRequestApiError';

export default class AnnouncementService extends AbstractService {
  public static async getAnnouncement(
    loggedInUserId: number,
    announcementId: number
  ): Promise<Announcement> {
    const user = await this.findUserOrThrow(loggedInUserId);
    const announcementsRepository = getRepository<Announcement>(Announcement);
    const announcement = await announcementsRepository.findOne(announcementId, {
      relations: ['organization'],
    });

    if (!announcement) {
      throw new ResourceNotFoundError('Announcement not found.');
    }

    await this.throwIfNotBelongsToOrganization(
      user,
      await announcement.organization
    );

    return announcement;
  }

  public static async createAnnouncement(
    loggedInUserId: number,
    organizationId: number,
    createAnnouncementParams: CreateAnnouncementParams
  ): Promise<Announcement> {
    const organization = await this.findOrganizationOrThrow(organizationId);
    const user = await this.findUserOrThrow(loggedInUserId);
    await this.throwIfNotBelongsToOrganization(user, organization);

    const announcementsRepository = getRepository<Announcement>(Announcement);
    const announcement = new Announcement();
    announcement.author = Promise.resolve(user);
    announcement.organization = Promise.resolve(organization);
    announcement.title = createAnnouncementParams.title;
    announcement.content = createAnnouncementParams.content;
    announcement.draft = true;

    return announcementsRepository.save(announcement);
  }

  public static async updateAnnouncement(
    loggedInUserId: number,
    announcementId: number,
    updateAnnouncementParams: UpdateAnnouncementParams
  ): Promise<Announcement> {
    const announcementRespository = getRepository<Announcement>(Announcement);
    const user = await this.findUserOrThrow(loggedInUserId);
    const announcement = await announcementRespository.findOne(announcementId);
    if (!announcement) {
      throw new ResourceNotFoundError('Announcement not found.');
    }

    if ((await announcement.author).id !== user.id) {
      throw new ForbiddenApiError(
        'You cannot make changes to this announcement.'
      );
    }

    announcement.title = updateAnnouncementParams.title;
    announcement.content = updateAnnouncementParams.content;

    return announcementRespository.save(announcement);
  }

  public static async publishAnnouncement(
    loggedInUserId: number,
    announcementId: number
  ): Promise<Announcement> {
    const announcementRespository = getRepository<Announcement>(Announcement);
    const user = await this.findUserOrThrow(loggedInUserId);
    const announcement = await announcementRespository.findOne(announcementId);
    if (!announcement) {
      throw new ResourceNotFoundError('Announcement not found.');
    }

    if ((await announcement.author).id !== user.id) {
      throw new ForbiddenApiError(
        'You do not have permission to publish this announcement.'
      );
    }

    if (!announcement.draft) {
      throw new BadRequestApiError('This announcement is already published.');
    }

    announcement.draft = false;

    return announcementRespository.save(announcement);
  }

  public static async getPublicAnnouncementsForOrganization(
    loggedInUserId: number,
    organizationId: number,
    offset: number = 0,
    limit: number = 10
  ): Promise<AnnouncementResponse[]> {
    const organization = await this.findOrganizationOrThrow(organizationId);
    const user = await this.findUserOrThrow(loggedInUserId);
    await this.throwIfNotBelongsToOrganization(user, organization);

    const announcementsRepository = getRepository<Announcement>(Announcement);
    const announcements = await announcementsRepository.find({
      relations: ['author'],
      where: { organization: organizationId, draft: false },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    const announcementResponses: AnnouncementResponse[] = await Promise.all(
      announcements.map(async (announcement) => {
        const author = await announcement.author;

        const response: AnnouncementResponse = {
          author: {
            id: author.id,
            name: author.name,
          },
          content: announcement.content,
          createdAt: announcement.createdAt,
          id: announcement.id,
          isRead: false,
          numberOfComments: announcement.numberOfComments,
          title: announcement.title,
        };

        return response;
      })
    );

    return announcementResponses;
  }
}

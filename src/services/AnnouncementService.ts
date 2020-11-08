import {
  AnnouncementResponse,
  CommentResourceType,
  CommentResponse,
  CreateAnnouncementParams,
  UpdateAnnouncementParams,
} from '../types';
import { getRepository } from 'typeorm';
import ResourceNotFoundError from '../errors/ResourceNotFoundError';
import ForbiddenApiError from '../errors/ForbiddenApiError';
import Announcement from '../entity/Announcement';
import AbstractService from './AbstractService';
import BadRequestApiError from '../errors/BadRequestApiError';
import Comment from '../entity/Comment';

export default class AnnouncementService extends AbstractService {
  public static async getAnnouncement(
    loggedInUserId: number,
    announcementId: number
  ): Promise<AnnouncementResponse> {
    const user = await this.findUserOrThrow(loggedInUserId);
    const announcementsRepository = getRepository<Announcement>(Announcement);
    const announcement = await announcementsRepository.findOne(announcementId, {
      relations: ['organization', 'author'],
    });

    if (!announcement) {
      throw new ResourceNotFoundError('Announcement not found.');
    }

    await this.throwIfNotBelongsToOrganization(
      user,
      await announcement.organization
    );

    return this.toAnnouncementResponse(announcement);
  }

  public static async createAnnouncement(
    loggedInUserId: number,
    organizationId: number,
    createAnnouncementParams: CreateAnnouncementParams
  ): Promise<AnnouncementResponse> {
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

    return this.toAnnouncementResponse(
      await announcementsRepository.save(announcement)
    );
  }

  public static async updateAnnouncement(
    loggedInUserId: number,
    announcementId: number,
    updateAnnouncementParams: UpdateAnnouncementParams
  ): Promise<AnnouncementResponse> {
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

    return this.toAnnouncementResponse(
      await announcementRespository.save(announcement)
    );
  }

  public static async publishAnnouncement(
    loggedInUserId: number,
    announcementId: number
  ): Promise<AnnouncementResponse> {
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

    return this.toAnnouncementResponse(
      await announcementRespository.save(announcement)
    );
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

    return await Promise.all(
      announcements.map(async (announcement) =>
        this.toAnnouncementResponse(announcement)
      )
    );
  }

  public static async getCommentsForAnnouncement(
    loggedInUserId: number,
    announcementId: number
  ): Promise<CommentResponse[]> {
    const user = await this.findUserOrThrow(loggedInUserId);

    const announcementsRepository = getRepository<Announcement>(Announcement);
    const commentsRepository = getRepository<Comment>(Comment);

    const announcement = await announcementsRepository.findOne(announcementId);

    await this.throwIfNotBelongsToOrganization(
      user,
      await announcement.organization
    );

    const comments = await commentsRepository.find({
      where: {
        resourceType: CommentResourceType.ANNOUNCEMENT,
        resourceId: announcementId,
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['author'],
    });

    return comments.map((comment) => this.toCommentResponse(comment));
  }

  public static async postCommentToAnnouncement(
    loggedInUserId: number,
    announcementId: number,
    content: string
  ): Promise<CommentResponse> {
    const user = await this.findUserOrThrow(loggedInUserId);

    const announcementsRepository = getRepository<Announcement>(Announcement);
    const commentsRepository = getRepository<Comment>(Comment);

    const announcement = await announcementsRepository.findOne(announcementId);

    await this.throwIfNotBelongsToOrganization(
      user,
      await announcement.organization
    );

    const comment = new Comment();
    comment.resourceType = CommentResourceType.ANNOUNCEMENT;
    comment.resourceId = announcement.id;
    comment.content = content;
    comment.author = user;

    const savedComment = await commentsRepository.save(comment);

    announcement.numberOfComments += 1;
    await announcementsRepository.save(announcement);

    return this.toCommentResponse(savedComment);
  }

  private static toCommentResponse(comment: Comment): CommentResponse {
    return {
      id: comment.id,
      author: { id: comment.author.id, name: comment.author.fullName },
      content: comment.content,
      createdAt: comment.createdAt,
    };
  }

  private static async toAnnouncementResponse(
    announcement: Announcement
  ): Promise<AnnouncementResponse> {
    const author = await announcement.author;

    return {
      author: { id: author.id, name: author.fullName },
      content: announcement.content,
      createdAt: announcement.createdAt,
      id: announcement.id,
      isRead: false,
      numberOfComments: announcement.numberOfComments,
      title: announcement.title,
      draft: announcement.draft,
    };
  }
}

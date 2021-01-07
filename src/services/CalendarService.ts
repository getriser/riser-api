import AbstractService from './AbstractService';
import {
  CreateEventParams,
  EventResponse,
  OrganizationUserRole,
} from '../types';
import { getRepository } from 'typeorm';
import CalendarEvent from '../entity/CalendarEvent';

export default class CalendarService extends AbstractService {
  public static async createEvent(
    loggedInUserId: number,
    organizationId: number,
    createEventParams: CreateEventParams
  ): Promise<EventResponse> {
    const user = await this.findUserOrThrow(loggedInUserId);
    const organization = await this.findOrganizationOrThrow(organizationId);
    await this.throwIfNotBelongsToOrganization(user, organization);
    await this.throwIfNotRequiredRole(
      user,
      organization,
      OrganizationUserRole.OWNER
    );

    const eventRepository = getRepository<CalendarEvent>(CalendarEvent);

    const event = new CalendarEvent();
    event.title = createEventParams.title;
    event.startDateUtc = createEventParams.startDateUtc;
    event.endDateUtc = createEventParams.endDateUtc;
    event.isAllDay = createEventParams.isAllDay;
    event.duration = createEventParams.duration;
    event.isRecurring = createEventParams.isRecurring;
    event.recurrencePattern = createEventParams.recurrencePattern;
    event.organization = Promise.resolve(organization);
    event.user = Promise.resolve(user);

    return this.toEventResponse(await eventRepository.save(event));
  }

  public static getEventsBetween(
    loggedInUserId: number,
    organizationId: number,
    startDateUtc: Date,
    endDateUtc: Date
  ): EventResponse[] {
    return [];
  }

  private static toEventResponse(calendarEvent: CalendarEvent): EventResponse {
    const eventResponse: EventResponse = {
      duration: calendarEvent.duration,
      endDateUtc: calendarEvent.endDateUtc,
      isAllDay: calendarEvent.isAllDay,
      isRecurring: calendarEvent.isRecurring,
      recurrencePattern: calendarEvent.recurrencePattern,
      startDateUtc: calendarEvent.startDateUtc,
      title: calendarEvent.title,
    };

    return eventResponse;
  }
}

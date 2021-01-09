import ConnectionUtil from '../test-utils/ConnectionUtil';
import { createOrganization, createUser } from '../test-utils/Factories';
import { CreateEventParams } from '../types';

describe('CalendarService', () => {
  beforeAll(async () => {
    await ConnectionUtil.connect();
  });

  afterAll(async () => {
    await ConnectionUtil.disconnect();
  });

  describe('createEvent', () => {
    it('creates a calendar event', async (done) => {
      const user = await createUser();
      const organization = await createOrganization(user);

      const createEventParams : CreateEventParams = {
        duration: 0,
        endDateUtc: undefined,
        isAllDay: false,
        isRecurring: false,
        recurrencePattern: '',
        startDateUtc: undefined,
        title: ''
      }


    });

    it('sets the duration correctly');

    it('cannot create an event whose end date is before the start date');

    describe('recurring events', () => {
      it('sets the end date to the last occurrence if present');
      it('sets the end date to the end of time if not present');
    });
  });

  describe('getEventsBetween', () => {
    it('returns events between a start date and an end date');

    describe('recurring events', () => {
      it('returns correctly generated recurring events');
    });
  });
});

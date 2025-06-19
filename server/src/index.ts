
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import { 
  createPatientInputSchema,
  getPatientByEmailInputSchema,
  createAppointmentInputSchema,
  getAppointmentsByDateRangeInputSchema,
  updateAppointmentStatusInputSchema,
  createContactMessageInputSchema,
  updateContactMessageStatusInputSchema,
  createServiceInputSchema
} from './schema';

// Import handlers
import { createPatient } from './handlers/create_patient';
import { getPatientByEmail } from './handlers/get_patient_by_email';
import { createAppointment } from './handlers/create_appointment';
import { getAppointmentsByDateRange } from './handlers/get_appointments_by_date_range';
import { updateAppointmentStatus } from './handlers/update_appointment_status';
import { createContactMessage } from './handlers/create_contact_message';
import { getContactMessages } from './handlers/get_contact_messages';
import { updateContactMessageStatus } from './handlers/update_contact_message_status';
import { createService } from './handlers/create_service';
import { getServices } from './handlers/get_services';
import { getActiveServices } from './handlers/get_active_services';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Patient operations
  createPatient: publicProcedure
    .input(createPatientInputSchema)
    .mutation(({ input }) => createPatient(input)),

  getPatientByEmail: publicProcedure
    .input(getPatientByEmailInputSchema)
    .query(({ input }) => getPatientByEmail(input)),

  // Appointment operations
  createAppointment: publicProcedure
    .input(createAppointmentInputSchema)
    .mutation(({ input }) => createAppointment(input)),

  getAppointmentsByDateRange: publicProcedure
    .input(getAppointmentsByDateRangeInputSchema)
    .query(({ input }) => getAppointmentsByDateRange(input)),

  updateAppointmentStatus: publicProcedure
    .input(updateAppointmentStatusInputSchema)
    .mutation(({ input }) => updateAppointmentStatus(input)),

  // Contact message operations
  createContactMessage: publicProcedure
    .input(createContactMessageInputSchema)
    .mutation(({ input }) => createContactMessage(input)),

  getContactMessages: publicProcedure
    .query(() => getContactMessages()),

  updateContactMessageStatus: publicProcedure
    .input(updateContactMessageStatusInputSchema)
    .mutation(({ input }) => updateContactMessageStatus(input)),

  // Service operations
  createService: publicProcedure
    .input(createServiceInputSchema)
    .mutation(({ input }) => createService(input)),

  getServices: publicProcedure
    .query(() => getServices()),

  getActiveServices: publicProcedure
    .query(() => getActiveServices()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors({
        origin: process.env['CLIENT_URL'] || 'http://localhost:3000',
        credentials: true,
      })(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  
  server.listen(port);
  console.log(`🏥 Podomus TRPC server listening at port: ${port}`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - Patient Management: createPatient, getPatientByEmail`);
  console.log(`   - Appointments: createAppointment, getAppointmentsByDateRange, updateAppointmentStatus`);
  console.log(`   - Contact: createContactMessage, getContactMessages, updateContactMessageStatus`);
  console.log(`   - Services: createService, getServices, getActiveServices`);
}

start();

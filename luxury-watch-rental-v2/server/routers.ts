import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { differenceInDays } from "date-fns";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  watches: router({
    list: publicProcedure.query(async () => {
      return await db.getAllWatches();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getWatchById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        brand: z.string(),
        model: z.string(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        backImageUrl: z.string().optional(),
        caseSize: z.string().optional(),
        movement: z.string().optional(),
        waterResistance: z.string().optional(),
        material: z.string().optional(),
        dailyRate: z.number().default(200),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await db.createWatch(input);
        return { success: true };
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        data: z.object({
          name: z.string().optional(),
          brand: z.string().optional(),
          model: z.string().optional(),
          description: z.string().optional(),
          imageUrl: z.string().optional(),
          backImageUrl: z.string().optional(),
          caseSize: z.string().optional(),
          movement: z.string().optional(),
          waterResistance: z.string().optional(),
          material: z.string().optional(),
          available: z.boolean().optional(),
          dailyRate: z.number().optional(),
        }),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await db.updateWatch(input.id, input.data);
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        await db.deleteWatch(input.id);
        return { success: true };
      }),
  }),

  rentals: router({
    myRentals: protectedProcedure.query(async ({ ctx }) => {
      return await db.getRentalsByUserId(ctx.user.id);
    }),
    
    getAllRentals: adminProcedure.query(async () => {
      return await db.getAllRentals();
    }),
    
    myActiveRentals: protectedProcedure.query(async ({ ctx }) => {
      return await db.getActiveRentalsByUserId(ctx.user.id);
    }),
    
    checkAvailability: publicProcedure
      .input(z.object({
        watchId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }))
      .query(async ({ input }) => {
        const available = await db.isWatchAvailable(input.watchId, input.startDate, input.endDate);
        return { available };
      }),
    
    create: protectedProcedure
      .input(z.object({
        watchId: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      }))
      .mutation(async ({ input, ctx }) => {
        const days = differenceInDays(input.endDate, input.startDate) + 1;
        if (days > 14) {
          throw new Error('Maximum rental period is 14 days');
        }
        if (days < 1) {
          throw new Error('End date must be after start date');
        }
        
        const available = await db.isWatchAvailable(input.watchId, input.startDate, input.endDate);
        if (!available) {
          throw new Error('Watch is not available for selected dates');
        }
        
        const watch = await db.getWatchById(input.watchId);
        if (!watch) {
          throw new Error('Watch not found');
        }
        
        const totalCost = days * watch.dailyRate;
        
        await db.createRental({
          watchId: input.watchId,
          userId: ctx.user.id,
          startDate: input.startDate,
          endDate: input.endDate,
          status: 'pending',
          totalCost,
        });
        
        // Watch stays available until rental is activated
        
        return { success: true, totalCost };
      }),
    
    complete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const rental = await db.getRentalById(input.id);
        if (!rental) {
          throw new Error('Rental not found');
        }
        if (rental.userId !== ctx.user.id && ctx.user.role !== 'admin') {
          throw new Error('Unauthorized');
        }
        
        await db.updateRental(input.id, { 
          status: 'completed',
          completedAt: new Date(),
        });
        await db.updateWatch(rental.watchId, { available: true });
        
        // Create invoice for completed rental
        try {
          await db.createInvoice({
            rentalId: input.id,
            userId: rental.userId,
            amount: rental.totalCost,
            status: 'paid',
          });
        } catch (e) {
          console.warn('[Invoice] Failed to create invoice for rental', input.id, e);
        }
        
        return { success: true };
      }),
    
    togglePayment: adminProcedure
      .input(z.object({ 
        id: z.number(),
        paymentReceived: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        await db.updateRental(input.id, { paymentReceived: input.paymentReceived });
        return { success: true };
      }),
    
    cancel: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const rental = await db.getRentalById(input.id);
        if (!rental) {
          throw new Error('Rental not found');
        }
        
        await db.updateRental(input.id, { 
          status: 'cancelled',
          cancelledAt: new Date(),
        });
        
        // Only make watch available if it was active (unavailable)
        if (rental.status === 'active') {
          await db.updateWatch(rental.watchId, { available: true });
        }
        
        return { success: true };
      }),
    
    updateNotes: adminProcedure
      .input(z.object({ 
        id: z.number(),
        notes: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.updateRental(input.id, { notes: input.notes });
        return { success: true };
      }),
    
    activate: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const rental = await db.getRentalById(input.id);
        if (!rental) {
          throw new Error('Rental not found');
        }
        if (rental.status !== 'pending') {
          throw new Error('Only pending rentals can be activated');
        }
        
        await db.updateRental(input.id, { 
          status: 'active',
          activatedAt: new Date(),
        });
        await db.updateWatch(rental.watchId, { available: false });
        
        return { success: true };
      }),
  }),

  invoices: router({
    myInvoices: protectedProcedure.query(async ({ ctx }) => {
      return await db.getInvoicesByUserId(ctx.user.id);
    }),
    
    getAllInvoices: adminProcedure.query(async () => {
      return await db.getAllInvoices();
    }),
  }),

  users: router({
    list: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
  }),

  reviews: router({
    uploadPhoto: protectedProcedure
      .input(z.object({
        file: z.string(), // base64 encoded image
        fileName: z.string(),
        contentType: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { uploadReviewPhoto } = await import('./storage');
        const result = await uploadReviewPhoto(input.file, input.fileName, input.contentType);
        return result;
      }),
    
    getByWatchId: publicProcedure
      .input(z.object({ watchId: z.number() }))
      .query(async ({ input }) => {
        const reviewsList = await db.getReviewsByWatchId(input.watchId);
        return reviewsList;
      }),
    
    getAverageRating: publicProcedure
      .input(z.object({ watchId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAverageRating(input.watchId);
      }),
    
    create: protectedProcedure
      .input(z.object({
        watchId: z.number(),
        rentalId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
        photoUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Verify rental belongs to user and is completed
        const rental = await db.getRentalById(input.rentalId);
        if (!rental) {
          throw new Error('Rental not found');
        }
        if (rental.userId !== ctx.user.id) {
          throw new Error('Unauthorized');
        }
        if (rental.status !== 'completed') {
          throw new Error('Can only review completed rentals');
        }
        
        // Check if review already exists
        const existingReview = await db.getReviewByRentalId(input.rentalId);
        if (existingReview) {
          throw new Error('Review already submitted for this rental');
        }
        
        await db.createReview({
          watchId: input.watchId,
          userId: ctx.user.id,
          rentalId: input.rentalId,
          rating: input.rating,
          comment: input.comment,
          photoUrl: input.photoUrl,
        });
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

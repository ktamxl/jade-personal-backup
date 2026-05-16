import { notifyOwner } from "./_core/notification";
import * as db from "./db";
import { differenceInDays, format } from "date-fns";

/**
 * Check for rentals that are due in 2 days and send notifications to admin
 */
export async function sendRentalReminders() {
  try {
    const allRentals = await db.getAllRentals();
    const activeRentals = allRentals.filter(r => r.status === 'active');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingReturns: string[] = [];
    
    for (const rental of activeRentals) {
      const endDate = new Date(rental.endDate);
      endDate.setHours(0, 0, 0, 0);
      
      const daysUntilReturn = differenceInDays(endDate, today);
      
      // Collect rentals due in 2 days
      if (daysUntilReturn === 2) {
        const watch = await db.getWatchById(rental.watchId);
        
        if (!watch) continue;
        
        const watchName = `${watch.brand} ${watch.name}`;
        const returnDate = format(endDate, 'MMMM d, yyyy');
        
        // Get user info from rentals table (it includes userId)
        const rentalInfo = allRentals.find(r => r.id === rental.id);
        const userName = rentalInfo ? `User ID: ${rentalInfo.userId}` : 'Unknown User';
        
        upcomingReturns.push(`• ${watchName} - ${userName} - Due: ${returnDate}`);
      }
    }
    
    // Send single notification with all upcoming returns
    if (upcomingReturns.length > 0) {
      await notifyOwner({
        title: `Watch Return Reminders (${upcomingReturns.length})`,
        content: `The following watches are due for return in 2 days:\n\n${upcomingReturns.join('\n')}\n\nPlease contact the renters to remind them of the upcoming return dates.`,
      });
      
      console.log(`Sent rental reminders for ${upcomingReturns.length} watches`);
    }
  } catch (error) {
    console.error('Error sending rental reminders:', error);
  }
}

/**
 * Check for overdue rentals and send notifications to admin
 */
export async function sendOverdueNotifications() {
  try {
    const allRentals = await db.getAllRentals();
    const activeRentals = allRentals.filter(r => r.status === 'active');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const overdueRentals: string[] = [];
    
    for (const rental of activeRentals) {
      const endDate = new Date(rental.endDate);
      endDate.setHours(0, 0, 0, 0);
      
      const daysOverdue = differenceInDays(today, endDate);
      
      // Collect overdue rentals
      if (daysOverdue > 0) {
        const watch = await db.getWatchById(rental.watchId);
        
        if (!watch) continue;
        
        const watchName = `${watch.brand} ${watch.name}`;
        const returnDate = format(endDate, 'MMMM d, yyyy');
        const rentalInfo = allRentals.find(r => r.id === rental.id);
        const userName = rentalInfo ? `User ID: ${rentalInfo.userId}` : 'Unknown User';
        
        overdueRentals.push(`• ${watchName} - ${userName} - Was due: ${returnDate} (${daysOverdue} days overdue)`);
      }
    }
    
    // Send single notification with all overdue rentals
    if (overdueRentals.length > 0) {
      await notifyOwner({
        title: `⚠️ Overdue Watch Rentals (${overdueRentals.length})`,
        content: `The following watches are overdue:\n\n${overdueRentals.join('\n')}\n\nPlease follow up with the renters to arrange return of these watches.`,
      });
      
      console.log(`Sent overdue notifications for ${overdueRentals.length} watches`);
    }
  } catch (error) {
    console.error('Error sending overdue notifications:', error);
  }
}

/**
 * Run daily check for rental reminders and overdue notifications
 */
export async function runDailyNotifications() {
  console.log('[Notifications] Running daily rental checks...');
  await sendRentalReminders();
  await sendOverdueNotifications();
  console.log('[Notifications] Daily rental checks completed');
}

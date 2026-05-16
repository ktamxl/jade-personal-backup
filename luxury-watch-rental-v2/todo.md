# Luxury Watch Rental - Project TODO

## Core Features

- [x] User authentication system (login for friends and family)
- [x] Watch catalog with photos and descriptions
- [x] Watch detail pages
- [x] Calendar reservation system (max 14 days per rental)
- [x] Rental rate calculation ($2.00 per day)
- [x] Rental tracking (active rentals, return dates)
- [x] Billing invoice generation
- [ ] Return notification system
- [ ] Admin dashboard for watch management
- [ ] User management (add/edit users, credentials)

## Frontend Pages

- [x] Homepage/Landing page
- [x] Login page
- [x] Watch catalog/browse page
- [x] Individual watch detail page with reservation
- [x] User dashboard (my rentals, upcoming returns)
- [ ] Admin dashboard (manage watches, users, rentals)
- [x] Billing/invoice page

## Backend Features

- [x] Database schema (users, watches, rentals, invoices)
- [x] Authentication API
- [x] Watch CRUD API
- [x] Rental booking API
- [x] Billing calculation API
- [ ] Notification system
- [ ] User management API

## New Feature: Rating & Review System

- [x] Database schema for reviews table
- [x] Backend API for creating reviews
- [x] Backend API for fetching watch reviews
- [x] Review form on watch detail page
- [x] Display reviews on watch detail page
- [x] Display average rating on catalog cards
- [x] Only allow reviews for completed rentals

## New Feature: Review Photo Uploads

- [x] Add photoUrl field to reviews table
- [x] Backend API for uploading review photos to S3
- [x] Frontend photo upload component in review form
- [x] Display review photos in review cards
- [x] Image preview before upload
- [x] Support multiple image formats (jpg, png, webp)

## New Feature: Front & Back Watch Photos

- [x] Add backImageUrl field to watches table
- [x] Update Catalog page with photo toggle buttons
- [x] Update WatchDetail page with photo toggle buttons
- [x] Add smooth transition animation between photos
- [ ] Update seed script to include back photos

## UI Update: Solid Star Ratings

- [x] Update Catalog page star styling to solid yellow
- [x] Update WatchDetail page star styling to solid yellow
- [x] Update Dashboard page star styling to solid yellow

## Bug Fix: Google Drive Image Links

- [x] Check current watch data in database
- [x] Convert Google Drive share links to direct image URLs
- [x] Update database with corrected image URLs
- [x] Verify images display correctly on webpage

## Bug Fix: Google Drive Images Still Not Displaying

- [x] Test Google Drive direct URLs
- [x] Check Google Drive file permissions
- [x] Download images and upload to project storage
- [x] Update database with working image URLs
- [x] Verify images display correctly

## Bug Fix: Star Ratings Still Outlined

- [x] Check current Catalog star rendering code
- [x] Ensure all stars use fill styling
- [x] Verify changes are applied correctly
- [x] Test star display on all pages

## Feature: Support Rectangular Watch Photos

- [x] Update Catalog page image containers to preserve aspect ratio
- [x] Update WatchDetail page image containers to preserve aspect ratio
- [x] Remove square cropping constraints
- [x] Test with rectangular watch photos

## Bug Fix: Watch Status Still Showing Rented

- [x] Update watch status to 'available' in database
- [x] Verify status displays correctly on catalog

## Feature: NEW Badge for Recent Watches

- [x] Add logic to check if watch was created within 30 days
- [x] Add NEW badge to Catalog page for recent watches
- [x] Add NEW badge to WatchDetail page for recent watches
- [x] Style NEW badge with luxury gold theme
- [x] Test badge appears and disappears after 30 days

## Task: Upload New High-Resolution Photos

- [x] Receive Google Drive links from user
- [x] Download high-resolution photos
- [x] Upload to CDN
- [x] Update database with new URLs

## Bug Fix: Front and Back Photos Mixed Up

- [x] Swap imageUrl and backImageUrl in database
- [ ] Verify correct photos display

## Task: Convert Photos for Watches ID 2-5

- [x] Query database for watches 2-5
- [x] Extract Google Drive links
- [x] Download all photos from Google Drive
- [x] Upload all photos to CDN
- [x] Update database with CDN URLs
- [x] Verify all watches display correctly

## Critical Bug: Authentication and Rental Tracking

- [x] Investigate current authentication flow
- [x] Ensure users must log in before making reservations
- [x] Add login prompt/redirect for unauthenticated users
- [x] Display user information in rental records
- [x] Create admin view to see who rented which watches
- [ ] Test login and rental flow

## New Features: Admin Management & Notifications

### Admin Watch Management Interface
- [x] Create watch management page in admin dashboard
- [x] Add form to create new watches
- [x] Add photo upload functionality for watch images
- [x] Add edit watch functionality
- [x] Add delete watch functionality
- [x] Allow updating watch availability status

### Email Notifications
- [ ] Set up email notification system
- [ ] Create notification for 2 days before return due date
- [ ] Schedule automatic notification checks
- [ ] Test email delivery

### Catalog Browsing Fix
- [x] Allow users to view unavailable watch details
- [x] Disable Reserve button for unavailable watches
- [x] Show "Currently Unavailable" message instead of blocking access

## Bug Fix: Nested Anchor Tag Error

- [x] Fix nested `<a>` tag error in Catalog page
- [x] Ensure Link components don't wrap other Link components

## Bug Fix: Watch Return Workflow

- [x] Add backend API for returning watches (already exists as rentals.complete)
- [x] Update rental status to "returned"
- [x] Update watch availability to true
- [ ] Update invoice status to "paid" when returned
- [x] Add "Return Watch" button in Admin dashboard
- [x] Test complete return workflow

## Feature: Automated Email Reminders

- [x] Create email notification service using built-in notification API
- [x] Implement scheduled job to check rentals 2 days before return date
- [x] Send notifications to admin (Ken) with watch return tracking info
- [x] Schedule daily notifications at 9 AM
- [x] Include overdue rental alerts

## Feature: Payment Tracking

- [x] Add paymentReceived field to rentals table
- [x] Update backend API to toggle payment status
- [x] Add Payment Received checkbox in Admin dashboard
- [x] Display payment status in rental list
- [x] Test payment tracking functionality

## Bug Fix: Watch Management Edit Error

- [x] Fix TypeError in WatchManagement.tsx handleEdit function
- [x] Add null/undefined check for watch object
- [x] Remove specifications JSON parsing (use direct properties)
- [x] Fix dailyRate conversion (cents to dollars)
- [x] Test edit functionality on Watch Management page

## Bug Fix: Rental Workflow Issues

- [x] Add Cancel Rental button in Admin dashboard
- [x] Create backend API for cancelling rentals
- [x] Ensure cancelled rentals update watch availability to true
- [x] Verify Return Watch button updates watch availability
- [x] Remove manual availability toggle from Watch Management (make it read-only)
- [x] Add note that availability is auto-managed by rentals
- [x] Test complete rental lifecycle: Create → Cancel/Return → Availability updates

## Feature: Rental Status Timeline

- [x] Add status change timestamp fields to rentals table (activatedAt, completedAt, cancelledAt)
- [x] Update rental mutations to set timestamps on status changes
- [x] Create visual timeline component with status progression
- [x] Display timestamps for each status change
- [x] Add timeline dialog to Admin dashboard with View Timeline button
- [x] Style timeline with luxury theme (gold accents, dark background)
- [x] Test timeline with different rental statuses

## Feature: Rental Private Notes

- [x] Add notes field to rentals table (text type)
- [x] Create backend API for updating rental notes
- [x] Add notes textarea to timeline dialog in Admin dashboard
- [x] Display existing notes and allow editing
- [x] Manual save button with success toast notification
- [x] Style notes section with luxury theme (dark background, gold button)
- [x] Test notes feature with different rentals

## Bug Fix: Rental Activation Workflow

- [x] Change rental creation to start with 'pending' status
- [x] Keep watch available when rental is pending
- [x] Add activate rental API endpoint
- [x] Add "Activate Rental" button for pending rentals in Admin
- [x] Set activatedAt timestamp and change status to 'active' on activation
- [x] Make watch unavailable when rental is activated
- [x] Enable cancel button for pending rentals
- [x] Update cancel to only free watch if rental was active
- [x] Update Admin UI to show correct actions based on rental status
- [x] Style pending status badge with gold outline
- [x] Test complete workflow: Pending → Payment → Activate → Active → Return/Cancel

## Bug Fix: Admin Dashboard Rental Filter

- [x] Add status filter to Admin dashboard rentals table
- [x] Show only pending and active rentals by default
- [x] Add toggle button to view all rentals including cancelled/completed
- [x] Update empty state messages based on filter
- [x] Test filter functionality

## Bug Fix: Watch Back Photo Upload

- [x] Investigate why back photos are lost when adding watches
- [x] Found issue: backImageUrl was missing from API input schemas
- [x] Add backImageUrl to watch create mutation input schema
- [x] Add backImageUrl to watch update mutation input schema
- [x] Ensure both imageUrl and backImageUrl are saved to database
- [x] Test adding and editing watches with both photos

## Feature: Homepage Above-the-Fold Redesign

- [x] Reduce hero section height to make it more compact (py-12 instead of py-20)
- [x] Move "How It Works" section above the fold with compact cards
- [x] Move pricing section above the fold with compact layout
- [x] Adjust spacing and layout to fit all key info without scrolling
- [x] Use smaller text sizes and tighter spacing for density
- [x] Maintain responsive grid layout for mobile and desktop
- [x] All key information now visible on standard viewport sizes

## Feature: Elite Brands Showcase Page

- [x] Research and write brand stories for A. Lange & Söhne (founded 1845, German excellence)
- [x] Research and write brand stories for Patek Philippe (founded 1839, auction king)
- [x] Research and write brand stories for Vacheron Constantin (founded 1755, oldest manufacturer)
- [x] Research and write brand stories for Rolex (founded 1905, innovation leader)
- [x] Research and write brand stories for Parmigiani Fleurier (founded 1996, modern manufacture)
- [x] Create Brands.tsx page component with detailed histories
- [x] Design elegant layout with brand cards showing heritage and auction significance
- [x] Add navigation link to Brands page in header
- [x] Add route for /brands in App.tsx
- [x] Include auction house references (Phillips, Sotheby's, Christie's)
- [x] Test responsive design and content readability

## Feature: Monthly Watch News Blog

- [x] Research Panerai Luminor Marina Militare patina story (tritium-lacquer reaction)
- [x] Create Blog page component with article layout
- [x] Write comprehensive November 2025 article on Panerai non-matching dial remake
- [x] Cover historical context, chemical reaction, collector perspective, and significance
- [x] Add blog navigation link in header ("Blog")
- [x] Add route for /blog in App.tsx
- [x] Design article card layout with date, read time, and formatted content
- [x] Style with luxury theme (gold accents, dark background)
- [x] Test responsive design and readability

## Feature: Blog Article Images

- [x] Search for Panerai Luminor Marina Militare PAM 5218 images
- [x] Download high-quality watch photos (3 images: hero, detail, side view)
- [x] Copy images to client/public/blog folder
- [x] Add heroImage and images array to article data
- [x] Add hero image display after card header
- [x] Add article images with captions at end of content
- [x] Style images with rounded borders and captions
- [x] Test image display and responsive design

## Website Audit & Bug Fixes

- [x] Check Homepage for errors - OK
- [x] Check Collection page for errors - OK
- [x] Check Brands page for errors - OK
- [x] Check Blog page for errors - OK
- [x] Check Dashboard page for errors
- [x] Check Admin dashboard for errors
- [x] Check Watch Management page for errors
- [x] Fix WatchManagement auth guard (moved setLocation to useEffect)
- [x] Fix React rules of hooks violation in WatchManagement (moved all hooks before conditionals)
- [x] Fix Admin table layout (compact columns so Actions column is visible)
- [x] Fix Total Revenue calculation (fallback to completed rentals if no invoices)
- [x] Fix invoice creation on rental completion (now creates invoice when Return Watch is clicked)
- [x] Fix Dashboard Billing History (shows completed rentals as fallback when no invoices)
- [x] Fix Dashboard Billing History watch names (shows watch name instead of Rental #ID)
- [x] Fix useAuth hook to use proper tRPC logout mutation

## Privacy: Remove Last Names from All Displays

- [x] Create getFirstName() helper utility in client/src/lib/nameUtils.ts
- [x] Update Navigation component (logged-in user name shows first name only)
- [x] Update Admin dashboard getUserName helper (rentals, invoices tables)
- [x] Update Admin dashboard Users tab (name column shows first name only)
- [x] Update DashboardLayout sidebar user name display
- [x] Update backend getAllUsers to strip last names from API response
- [x] Test all pages to confirm no last names visible

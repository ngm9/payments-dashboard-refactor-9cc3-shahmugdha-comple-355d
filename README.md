# Task Overview
Utkrusht runs an internal Payments Dashboard that shows daily and monthly revenue statistics for each client account. The current implementation was assembled quickly and now suffers from slow loading times, duplicated request logic, and fragile DOM updates that occasionally break when the backend is slow or returns errors. Operations and finance teams rely on this dashboard to review payouts and reconcile invoices, so stale or inconsistent data has real business impact. Your work on this task will shape how reliably the dashboard behaves under real-world network conditions and how easily future engineers can extend it.

## Objectives
- Provide a coherent structure for loading payments data for a selected date range through a single, well-defined interface that other parts of the app can consume.
- Introduce a responsible caching strategy so that recent payment data can be reused while ensuring that obviously outdated information is not shown to users.
- Ensure that the UI can update its views without excessive layout shifts, and that changes in filters or date ranges do not cause unnecessary work.
- Design the code so that error scenarios, including unavailable backend services or invalid authentication, are surfaced clearly in the interface and do not crash the page.
- Organize modules and dependencies in a way that would make the codebase understandable and maintainable for another engineer joining the project.

## How to Verify
- Change the date range in the dashboard and observe that relevant daily and monthly numbers refresh together in a consistent way.
- Reload the page while using the same date range and confirm that recent data appears quickly without obviously stale information sticking around for too long.
- Temporarily simulate failing network responses and confirm that the page displays a clear message while still behaving predictably without breaking the main layout.
- Inspect DOM updates during interactions and verify that the page does not frequently flicker or rearrange content in a distracting way.
- Check how the application behaves when no authentication token is present and verify that the behavior is consistent and does not leave the dashboard in a half-broken state.

## Helpful Tips
- Consider how to separate responsibilities so that network access, caching, and UI rendering do not depend on each other's internal details.
- Think about how asynchronous flows will be coordinated when multiple pieces of data are needed for a single screen.
- Explore ways to minimize how often you touch the DOM and how you group visual updates to keep the interface smooth.
- Review how and where you read authentication information so that it is applied consistently for every relevant request.
- Reflect on how your design would accommodate new views or additional payment metrics without requiring major rewrites.

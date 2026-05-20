# TODO - Property Transaction Ledger Overview Fix

## Plan (approved)
- Identify why ledger shows "No payments in ledger yet" even after tenant submits payment.
- Root cause: PaymentDashboard uses `state.payments.payments` for Tenant ledger, but Firestore sync writes only to `paymentLedger` slice; Tenant ledger therefore never receives Firestore data.
- Fix: Render ledger from `paymentLedger.payments` for both roles, and for Tenant filter to only their own `tenantUid` (or `houseNumber`) so the ledger shows the correct tenant’s payments.
- Keep landlord verify/decline actions working by ensuring `updatePaymentStatus` and Firestore updates target the correct document.

## Steps
1. Update `src/Pages/PaymentDashboard.jsx` to compute `paymentHistory` from `paymentLedger.payments` for both roles.
2. Add tenant-specific filtering (by `tenantUid`) when currentRole is Tenant.
3. Update the Receipt preview sync to use the filtered `paymentHistory`.
4. Run lint/tests/build (or at least `npm run dev` / `npm run build`) to ensure no runtime errors.


# Hope CMS — User Manual
**Version 1.0 | Sprint 3 Final**

---

## Table of Contents
1. Getting Started
2. Registration
3. Login
4. Customer Management
5. Sales History Navigation
6. Product Catalogue
7. Reports
8. Admin — User Activation
9. Troubleshooting

---

## 1. Getting Started

Hope CMS is a Customer Management System accessible at your production URL. You need an account to log in. New accounts are created as **INACTIVE** and must be activated by a SUPERADMIN before you can log in.

---

## 2. Registration

### Email Registration
1. Go to the login page and click **Create one**
2. Fill in all required fields:
   - First Name
   - Last Name
   - Username
   - Email
   - Password (minimum 6 characters)
   - Confirm Password
3. Click **Create Account**
4. Wait for a SUPERADMIN to activate your account

### Google Registration
1. Click **Continue with Google**
2. Select your Google account
3. Wait for a SUPERADMIN to activate your account

---

## 3. Login

### Email Login
1. Enter your email and password
2. Click **Sign In**
3. If your account is INACTIVE, you will see: *"Your account is pending activation"*

### Google Login
1. Click **Continue with Google**
2. Select your Google account
3. You will be redirected to the dashboard if your account is ACTIVE

---

## 4. Customer Management

### Viewing Customers
- **USER**: sees ACTIVE customers only
- **ADMIN / SUPERADMIN**: sees all customers including INACTIVE

### Adding a Customer *(ADMIN / SUPERADMIN)*
1. Click **Add Customer**
2. Fill in: Customer No, Name, Address, Payment Term
3. Click **Save**

### Editing a Customer *(ADMIN / SUPERADMIN)*
1. Click the **Edit** button on a customer row
2. Update the fields
3. Click **Save**

### Soft Deleting a Customer *(SUPERADMIN only)*
1. Click the **Delete** button on a customer row
2. Confirm the action
3. Customer is set to INACTIVE (not permanently deleted)

### Recovering a Customer *(ADMIN / SUPERADMIN)*
1. Go to **Deleted Customers** page
2. Click **Recover** on the customer row
3. Customer is set back to ACTIVE

---

## 5. Sales History Navigation

1. Click on any customer name to open the Customer Detail page
2. View all sales transactions for that customer
3. Click on a transaction to view line items
4. Each line item shows: product description, quantity, unit price

---

## 6. Product Catalogue

- View all 52 products with description, unit, and current price
- Read-only — no add/edit/delete actions available for any user type

---

## 7. Reports

### Customer Sales Summary
- View all customers with total transactions, total spend, and last sale date
- Search by customer name
- Sortable by any column

### Product Revenue
- View all products with total quantity sold and total revenue
- Read-only, ordered by total revenue descending

---

## 8. Admin — User Activation *(SUPERADMIN only)*

1. Go to **Admin** in the sidebar
2. View all registered users
3. Click **Activate** to allow a user to log in
4. Click **Deactivate** to block a user from logging in
5. SUPERADMIN rows are fully protected — buttons are disabled

---

## 9. Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot log in | Check if your account is ACTIVE — contact your SUPERADMIN |
| Page shows "No customers found" | Your user type may only see ACTIVE customers |
| Buttons are greyed out | You don't have the required rights for that action |
| Google login not working | Check that your Google account email matches your registered email |
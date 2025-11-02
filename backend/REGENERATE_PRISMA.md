# Fix: Prisma Client Error - User Model Not Found

## Problem
Error: "Cannot read properties of undefined (reading 'findUnique')"

This happens when the Prisma client hasn't been regenerated after adding the User model.

## Solution

1. **Stop the backend server** (Press Ctrl+C in the terminal where it's running)

2. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

3. **Regenerate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **If you get permission errors, try:**
   ```bash
   # Windows PowerShell
   Remove-Item -Recurse -Force node_modules\.prisma
   npx prisma generate
   ```

5. **Restart the backend server:**
   ```bash
   npm run dev
   ```

The Prisma client will now include the User model and the error should be resolved.



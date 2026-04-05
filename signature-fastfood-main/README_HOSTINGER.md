# Hosting on Hostinger (React + PHP/MySQL)

To host this project on Hostinger, you need to build the React project into static HTML/JS files, and then upload them alongside the provided PHP files.

## 1. Database Setup
1. Log into your Hostinger hPanel.
2. Go to Databases -> **Management**.
3. Create a new MySQL database. Save the **DB Name**, **DB User**, and **Password**.
4. Click **Enter phpMyAdmin**.
5. Inside phpMyAdmin, go to the **SQL** tab.
6. Copy the contents of `backend/database.sql` and run it to create the `orders` table.

## 2. API Setup
1. Open `backend/api/db.php` in your code editor.
2. Update the credentials using the ones you created in step 1:
   ```php
   $db_name = 'YOUR_HOSTINGER_DB_NAME';
   $username = 'YOUR_HOSTINGER_DB_USER';
   $password = 'YOUR_HOSTINGER_DB_PASSWORD';
   ```

## 3. Build the Application
1. In your project, double-check that `src/lib/config.ts` has `USE_PHP_BACKEND = true`.
2. Open your terminal in the `signature-fastfood-main` directory.
3. Run the following command:
   ```bash
   npm run build
   ```
4. This will create a `dist` folder.

## 4. Upload to Hostinger
1. In Hostinger hPanel, go to **File Manager**.
2. Navigate to your `public_html` directory (or your domain's root).
3. Upload *ALL everything inside* your `dist` folder directly into `public_html`.
4. Upload the `/backend/api` folder into `public_html` so that you have a folder path of `public_html/api/db.php` etc.

Your site will now run completely on your Hostinger server, with the admin panel successfully reading and writing from your Hostinger MySQL database!

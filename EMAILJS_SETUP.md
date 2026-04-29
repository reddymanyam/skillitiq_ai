# 📧 EmailJS Setup Guide

To send real verification codes to **`hr.skillitiq@gmail.com`**, follow these steps:

---

## Step 1: Create a Free EmailJS Account
1. Go to **[https://dashboard.emailjs.com/sign-up](https://dashboard.emailjs.com/sign-up)**
2. Sign up with **`hr.skillitiq@gmail.com`** (free tier: 200 emails/month)
3. Verify your email

---

## Step 2: Connect Your Gmail Service
1. In the dashboard, go to **Email Services** (left sidebar)
2. Click **"Add New Service"**
3. Choose **Gmail**
4. Click **Connect Account** → sign in with `hr.skillitiq@gmail.com`
5. Copy the generated **Service ID** (looks like `service_abc1234`)

---

## Step 3: Create an Email Template
1. Go to **Email Templates** → **Create New Template**
2. **Settings tab:**
   - **To Email:** `{{to_email}}`
   - **From Name:** `SKILLITIQ AI`
   - **Reply To:** `{{student_email}}`
   - **Subject:** `{{subject}}`
3. **Content tab — paste this HTML:**

```html
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 12px; padding: 30px;">
    <h2 style="color: #2563eb;">SKILLITIQ AI – Email Verification</h2>
    <p>Hello Admin,</p>
    <p><strong>{{student_name}}</strong> ({{student_email}}) is requesting access to the Student Portal.</p>
    <p>Verification code:</p>
    <div style="background: #eff6ff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
      <div style="font-size: 32px; font-weight: bold; color: #1e40af; letter-spacing: 8px;">{{otp_code}}</div>
    </div>
    <p style="color: #666; font-size: 12px;">Time: {{time}}</p>
    <p style="color: #666; font-size: 12px;">This code expires in 10 minutes.</p>
    <hr style="border:none; border-top:1px solid #e5e7eb; margin: 20px 0;" />
    <p style="color: #999; font-size: 11px;">© 2026 SKILLITIQ AI. All rights reserved.</p>
  </div>
</body>
</html>
```

4. Click **Save**
5. Copy the **Template ID** (looks like `template_xyz5678`)

---

## Step 4: Get Your Public Key
1. Go to **Account → General** (top right)
2. Find **Public Key** under API Keys
3. Copy it (looks like `aBcDeFgHi1234567`)

---

## Step 5: Paste Credentials Into Your Code

Open **`src/components/StudentPortal.tsx`** at the top and update:

```ts
const EMAILJS_CONFIG = {
  SERVICE_ID:  'service_abc1234',     // ← paste your Service ID
  TEMPLATE_ID: 'template_xyz5678',    // ← paste your Template ID
  PUBLIC_KEY:  'aBcDeFgHi1234567',    // ← paste your Public Key
  TO_EMAIL:    'hr.skillitiq@gmail.com',
};
```

Save → run `npm run build` → done! ✅

---

## How It Works

When a student clicks **"Verify Email"** in the portal:

1. A random 6-digit code is generated
2. EmailJS sends it to **`hr.skillitiq@gmail.com`** with student details
3. Admin (you) reads the email and shares the code with the student
4. Student enters code → dashboard unlocks 🎉

---

## Limits
- **Free tier:** 200 emails/month, 50 KB/email
- **Plus:** $7/month for 1,000 emails

For more, see [https://www.emailjs.com/pricing/](https://www.emailjs.com/pricing/)

---

## Troubleshooting
- **"Failed to send email"** → Check Service/Template/Public Key values
- **No email received** → Check spam folder, verify Gmail service is connected
- **403 error** → Public key is wrong or domain not whitelisted (in EmailJS settings, allow `localhost` and your live domain)

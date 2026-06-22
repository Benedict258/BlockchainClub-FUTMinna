# WhatsApp Bot Setup Guide

Connect the BlockchainClub-FUTMinna WhatsApp bot via the Twilio sandbox for testing, then go live with WhatsApp Business API.

## 1. Prerequisites

- **Twilio account** — free trial works (no credit card needed initially for sandbox)
- **Supabase project** with the `whatsapp_interactions` table created (see [Database Setup](#4-database-setup))
- **`profiles.phone`** column populated for members so messages can be matched to user accounts

## 2. Twilio Sandbox Setup

1. Go to [console.twilio.com](https://console.twilio.com) and sign up / log in.
2. Navigate to **Messaging > Try it out > Send a WhatsApp message**.
3. Note the sandbox join code displayed on the page. From your phone, send that code as a WhatsApp message to the sandbox number.
4. Once joined, go to **Messaging > Settings > WhatsApp Sandbox Settings**.
5. Under **When a message comes in**, set:
   - **URL:** `https://your-deployment-url.vercel.app/api/whatsapp/webhook`
   - **Method:** `POST`
6. Click **Save**.

## 3. Environment Variables

Add these to your deployment environment:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
```

Find these on the [Twilio console dashboard](https://console.twilio.com).

## 4. Database Setup

Run this SQL in your Supabase SQL editor to create the interactions table:

```sql
CREATE TABLE IF NOT EXISTS whatsapp_interactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number text NOT NULL,
  user_id text REFERENCES users(id),
  message_body text,
  classification text,
  points integer DEFAULT 0,
  group_id text,
  group_name text,
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
```

## 5. Testing

1. Send any WhatsApp message to the sandbox number from your joined phone.
2. Check the admin stats endpoint:

   ```bash
   curl -H "Authorization: Bearer <admin-token>" \
     https://your-deployment-url.vercel.app/api/whatsapp/stats
   ```

3. Verify the leaderboard reflects `community_points` for identified members.
4. Check `whatsapp_interactions` in your Supabase dashboard for the logged message.

## 6. Going Live

1. Apply for [WhatsApp Business API](https://www.twilio.com/whatsapp/business-api) access through Twilio.
2. Complete Facebook Business verification and create a WhatsApp Business Profile.
3. Once approved, update the sandbox webhook URL to point at the same `/api/whatsapp/webhook` endpoint.
4. No code changes needed — the bot handles both sandbox and production messages identically.

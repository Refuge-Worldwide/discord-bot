import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://covzovcqlxklhnrfzapy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvdnpvdmNxbHhrbGhucmZ6YXB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2NjEwMDk2NiwiZXhwIjoxOTgxNjc2OTY2fQ.LarZvURVcBWQXALKMfrzHSEUcSRbazZ93UuCrzzo-Bk"
);

import { supabase } from '../lib/supabaseClient';

const webhookURL = process.env.LIVE_ON_AIR_WEBHOOK_URL;
const generalChatwebhookURL: string = process.env.GENERAL_CHAT_WEBHOOK_URL as string;

type RadioCo = {
  status: "online" | "offline";
  source: {
    type: string;
    collaborator?: any;
    relay?: any;
  };
  collaborators: any[];
  relays: any[];
  current_track: {
    title: string;
    start_time: string;
    artwork_url: string;
    artwork_url_large: string;
  };
  history: { title: string }[];
  logo_url: string;
  streaming_hostname: string;
  outputs: {
    name: string;
    format: string;
    bitrate: number;
  }[];
};


export default async function handler(req, res) {
  try {
    const s = await fetch("https://refugeworldwide.com/api/schedule");
    const scheduleData: { liveNow: { title: string, artwork: string } } = await s.json()

    const liveNow: string = scheduleData.liveNow.title

    let { data, error } = await supabase
      .from('liveNow')
      .select('title')
      .eq('id', 1)

    if (data && data.length > 0) {
      const prevLiveNow: string = data[0].title

      console.log('prev live: ' + prevLiveNow)
      console.log('live: ' + liveNow)

      if (prevLiveNow != liveNow && (liveNow != "Refuge Worldwide - Refuge Worldwide" || "Intermission - Refuge Worldwide") && !liveNow.includes("(r)") && !liveNow.includes("!OVERWRITE!")) {
        const params = {
          "embeds": [{
            "title": 'Live now: ' + liveNow,
            "url": "https://refugeworldwide.com/",
            "image": {
              "url": scheduleData.liveNow.artwork
            },
          }]
        }

        const postMessageGeneralChat = await fetch(generalChatwebhookURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        })

        const { error } = await supabase
          .from('liveNow')
          .update({ title: liveNow })
          .eq('id', 1)

        res.status(200).send("Message posted successfully")
        return
      }

      res.status(200).send("Not a new live show")
    }
  } catch (error) {

    res.status(400);
    res.json({ message: error.message });
    return;
  }
}
import { supabase } from '../lib/supabaseClient';

const webhookURL = process.env.LIVE_ON_AIR_WEBHOOK_URL;
const generalChatwebhookURL = process.env.GENERAL_CHAT_WEBHOOK_URL;

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
    const scheduleData = await s.json()

    const liveNow = scheduleData.liveNow.title

    let { data, error } = await supabase
      .from('liveNow')
      .select('title')
      .eq('id', 1)

    const prevLiveNow = data[0].title

    console.log(prevLiveNow)

    if (prevLiveNow != liveNow && liveNow != "Refuge Worldwide - Refuge Worldwide") {
      const params = {
        "embeds": [{
          "title": 'Live now: ' + liveNow,
          "url": "https://refugeworldwide.com/",
          "image": {
            "url": scheduleData.liveNow.artwork
          },
        }]
      }

      const postMessage = await fetch(webhookURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!liveNow.includes("(r)")) {
        const postMessageGeneralChat = await fetch(generalChatwebhookURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        })
      }

      const { error } = await supabase
        .from('liveNow')
        .update({ title: liveNow })
        .eq('id', 1)

      res.status(200).send("Message posted successfully")
      return
    }

    res.status(200).send("Not a new live show")

  } catch (error) {

    res.status(400);
    res.json({ message: error.message });
    return;
  }
}
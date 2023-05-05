import { supabase } from '../lib/supabaseClient';

const webhookURL = 'https://discord.com/api/webhooks/1103679354120192030/4qggwRl5-zebUISlmr1IX1okzZqEibejgpTWNuTkZeWE1BRARzLiOh2M3KrHwVj3M2J5'

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


const handler = async (req, res) => {
  try {
    const r = await fetch("https://public.radio.co/stations/s3699c5e49/status");
    const radioCoData: RadioCo = await r.json();

    const liveNow = radioCoData.current_track.title

    let { data, error } = await supabase
      .from('liveNow')
      .select('title')
      .eq('id', 1)

    const prevLiveNow = data[0].title

    if (prevLiveNow != liveNow) {
      const params = {
        username: "Refuge Worldwide",
        avatar_url: "",
        content: 'Live now: ' + liveNow
      }

      const postMessage = await fetch(webhookURL, {
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

      res.status(400).json({
        message: 'Message posted successfully',
      });
    }

    res.status(400).json({
      message: 'Not a new live show',
    });

  } catch (error) {

    res.status(400).json({
      message: error.message,
    });
  }
}
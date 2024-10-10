import screenRec from "~/assets/projects/browser-screen-recorder.png";
import carbonBot from "~/assets/projects/carbon.png";
import compress from "~/assets/projects/compress.png";
import jiamusic from "~/assets/projects/jiamusic.png";
import lunarRun from "~/assets/projects/lunar.png";
import luaBot from "~/assets/projects/music-bot-lua.png";
import podWeb from "~/assets/projects/podter-website.png";
import urlShortener from "~/assets/projects/url-shortener.png";

interface Project {
  title: string;
  description: string;
  shortDescription?: string;
  img: ImageMetadata;
  url?: string;
  action?: string;
  sourceUrl?: string;
}

export const PROJECTS = [
  {
    title: "podter.me",
    description:
      "the website that you are currently on right now. built with astro, tailwindcss, auth.js, cloudflare d1, cloudflare kv, and deployed to cloudflare pages.",
    shortDescription:
      "the website that you are currently on right now. built with astro.",
    img: podWeb,
    sourceUrl: "https://github.com/Podter/podter.me",
  },
  {
    title: "s.podter.me",
    description:
      "the simplest url shortener. built with sveltekit, cloudflare kv, and deployed to cloudflare pages.",
    shortDescription:
      "the simplest url shortener. built with sveltekit and cloudflare kv.",
    img: urlShortener,
    url: "https://s.podter.me",
    sourceUrl: "https://github.com/Podter/s.podter.me",
  },
  {
    title: "compress.podter.me",
    description:
      "the simplest video compressor on the internet. built with react, ffmpeg, and webassembly. installable as a pwa on any device and works offline.",
    shortDescription:
      "the simplest video compressor. built with react, pwa, ffmpeg, and webassembly.",
    img: compress,
    url: "https://compress.podter.me",
    sourceUrl: "https://github.com/Podter/compress.podter.me",
  },
  {
    title: "Lunar Run",
    description:
      "an endless runner game. you play as a cat named lunar, and you have to collect as many cupcakes as possible while avoiding the obstacles. built with c# and unity.",
    shortDescription:
      "an endless runner game where you play as a cat named lunar. built with unity.",
    img: lunarRun,
    url: "https://lunar.podter.me",
    action: "play",
  },
  {
    title: "Carbon",
    description:
      "a discord bot that allows you to download video from the internet and send it to the channel. built with cobalt.tools, and hosted on cloudflare pages.",
    img: carbonBot,
    url: "https://discord.com/oauth2/authorize?client_id=1279199955424247808",
    sourceUrl: "https://github.com/Podter/carbon-bot",
    action: "invite",
  },
  {
    title: "JIΛmusic",
    description:
      "a music player that plays floptok musics. built with tauri, react, and pocketbase. made for one of the flop companies.",
    img: jiamusic,
    url: "https://github.com/Podter/jiamusic/releases/latest",
    sourceUrl: "https://github.com/Podter/jiamusic",
    action: "download",
  },
  {
    title: "Screen Recorder",
    description:
      "a webrtc screen recorder on your browser. built with javascript and installable as pwa. hosted on github pages.",
    img: screenRec,
    url: "https://podter.github.io/browser-screen-recorder",
    sourceUrl: "https://github.com/Podter/browser-screen-recorder",
  },
  {
    title: "Lua Music Bot",
    description:
      "yet another discord music bot written in lua using discordia. it's no longer maintained and archived on github.",
    img: luaBot,
    sourceUrl: "https://github.com/Podter/Music-Bot-Lua",
  },
] as const as Project[];

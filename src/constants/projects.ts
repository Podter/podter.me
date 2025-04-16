import brad from "~/assets/projects/brad.png";
import screenRec from "~/assets/projects/browser-screen-recorder.png";
import compress from "~/assets/projects/compress.png";
import demucsWeb from "~/assets/projects/demucs-web.png";
import grad from "~/assets/projects/grad.png";
import lunarRun from "~/assets/projects/lunar.png";
import markit from "~/assets/projects/markit.png";
import memoWrap from "~/assets/projects/memo-wrap.png";
import luaBot from "~/assets/projects/music-bot-lua.png";
import podWeb from "~/assets/projects/podter-website.png";
import queryly from "~/assets/projects/queryly.png";
import tasuku from "~/assets/projects/tasuku.png";
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
      "the website that you are currently on right now. built with astro, svelte, tailwindcss, auth.js, cloudflare d1, cloudflare kv, and deployed to cloudflare pages.",
    shortDescription:
      "the website that you are currently on right now. built with astro.",
    img: podWeb,
    sourceUrl: "https://github.com/Podter/podter.me",
  },
  {
    title: "Queryly",
    description:
      "search engine with ai-powered search results. built with astro, react, vercel ai sdk, and searxng.",
    shortDescription:
      "search engine with search results summarization using ai.",
    img: queryly,
    url: "https://queryly.podter.me",
    sourceUrl: "https://github.com/Podter/queryly",
  },
  {
    title: "demucs-web",
    description:
      "a web interface for demucs, a state-of-the-art music source separation model. separate vocals, drums, bass and others from any track.",
    shortDescription:
      "self-hostable web app for ai-powered music source separation.",
    img: demucsWeb,
    sourceUrl: "https://github.com/Podter/demucs-web",
  },
  {
    title: "s.podter.me",
    description:
      "the simplest url shortener. built with sveltekit, cloudflare kv, and deployed to cloudflare pages.",
    img: urlShortener,
    url: "https://s.podter.me",
    sourceUrl: "https://github.com/Podter/s.podter.me",
  },
  {
    title: "compress.podter.me",
    description:
      "the simplest video compressor on the internet. built with react, ffmpeg, and webassembly. installable as a pwa on any device and works offline.",
    img: compress,
    url: "https://compress.podter.me",
    sourceUrl: "https://github.com/Podter/compress.podter.me",
  },
  {
    title: "memo-wrap",
    description:
      "a javascript library for caching the result of function calls. it has customizable drivers and serializers. inspired by unstorage.",
    img: memoWrap,
    sourceUrl: "https://github.com/Podter/memo-wrap",
  },
  {
    title: "Markit",
    description:
      "a simple markdown editor that allows you to write and preview markdown in real-time. built with tauri and react.",
    img: markit,
    sourceUrl: "https://github.com/Podter/markit",
  },
  {
    title: "Tasuku",
    description:
      "a simple todo list app. built with expo, tamagui, trpc, better-auth, and drizzle. just an experiment project for testing expo api routes.",
    img: tasuku,
    sourceUrl: "https://github.com/Podter/tasuku",
  },
  {
    title: "Lunar Run",
    description:
      "an endless runner game. you play as a cat named lunar, and you have to collect as many cupcakes as possible while avoiding the obstacles. built with c# and unity.",
    img: lunarRun,
    url: "https://lunar.podter.me",
    action: "play",
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
  {
    title: "Grad",
    description:
      "a discord ai chatbot with tools. she can search the web, and remembering user information. you can call her an open-source version of brad.",
    img: grad,
    sourceUrl: "https://github.com/Podter/grad",
  },
  {
    title: "Brad",
    description:
      "a discord bot that helps me and my friends to get things done quickly. not available for public use, but can see him if you see me around.",
    shortDescription:
      "my private discord bot that helps me get things done quickly.",
    img: brad,
  },
] as const as Project[];

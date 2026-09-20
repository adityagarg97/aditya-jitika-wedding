import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  MapPin,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Phone,
  Check,
} from "lucide-react";
import "./styles.css";
import { getInvitation } from "./invitation.js";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const events = [
  {
    id: "engagement",
    title: "The Engagement",
    date: "2026-12-06",
    day: "Sunday",
    num: "06",
    month: "DEC",
    time: "7:00 PM onwards",
    start: "190000",
    venue: "The Ashok",
    detail: "Banquet Hall, 3rd Floor",
    address: "50-B Diplomatic Enclave, Chanakyapuri, New Delhi – 110021",
    description: "A promise of forever, surrounded by the people we love.",
    video: "engagement",
    label: "THE FIRST CHAPTER",
  },
  {
    id: "carnival",
    title: "Haldi Carnival",
    date: "2026-12-09",
    day: "Wednesday",
    num: "09",
    month: "DEC",
    time: "11:00 AM onwards",
    start: "110000",
    venue: "Green Garden Party Lawn",
    detail: "",
    address:
      "Plot No. 6, Chaudhary Dutta Ram Marg, Sector 7 Dwarka, Palam, New Delhi – 110077",
    description: "A morning of colour, laughter and a little golden sunshine.",
    video: "garden",
    label: "COLOURS OF JOY",
  },
  {
    id: "mehndi",
    title: "Haldi & Mehndi",
    date: "2026-12-10",
    day: "Thursday",
    num: "10",
    month: "DEC",
    time: "11:00 AM",
    start: "110000",
    venue: "Shri Radha Krishna Mandir",
    detail: "",
    address: "Greater Kailash, New Delhi",
    description:
      "Cherished traditions, heartfelt blessings and beautiful beginnings.",
    video: "wedding",
    label: "TRADITIONS & TOGETHERNESS",
  },
  {
    id: "ghurchari",
    title: "Ghurchari",
    date: "2026-12-11",
    day: "Friday",
    num: "11",
    month: "DEC",
    time: "4:00 PM",
    start: "160000",
    venue: "Greater Kailash, Part I",
    detail: "",
    address: "S-277, Greater Kailash Part 1, New Delhi",
    description: "With joyful hearts, the wedding celebrations begin.",
    video: "wedding",
    label: "THE WEDDING DAY",
  },
  {
    id: "wedding",
    title: "The Wedding",
    date: "2026-12-11",
    day: "Friday",
    num: "11",
    month: "DEC",
    time: "8:30 PM · Reception of Baraat",
    start: "203000",
    venue: "The Grand Pavilion",
    detail: "Formerly Pavilion by FNP Venues",
    address: "Block C, Chhatarpur Extension, Chhattarpur, New Delhi – 110074",
    description:
      "Two hearts, one beautiful forever. Celebrate our sacred union with us.",
    video: "haldi",
    label: "OUR FOREVER BEGINS",
  },
].sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start));
const venueMaps = {
  engagement: "https://maps.app.goo.gl/24TccrDPM9zDxcyA6",
  carnival: "https://maps.app.goo.gl/MmvuHuLn6FVQ1abL6?g_st=iw",
  mehndi: "https://maps.app.goo.gl/2mu9zHSWFZhrGA856",
  wedding: "https://maps.app.goo.gl/rGn15p6Hag3PmVT6A",
};
const mapUrl = (e) =>
  venueMaps[e.id] ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.address)}`;
function Film({ name, paused, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !paused) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "150px" },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, [paused]);
  return (
    <video
      ref={ref}
      className={`film ${className}`}
      poster={asset(`media/${name}.jpg`)}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    >
      <source src={asset(`media/${name}.mp4`)} type="video/mp4" />
    </video>
  );
}
function CeremonyDetails({ event, weddingDay = false }) {
  return (
    <div className={weddingDay ? "wedding-ceremony" : "ceremony-details"}>
      {weddingDay && (
        <div className="ceremony-heading">
          <h4>
            {event.id === "ghurchari" ? "Ghurchari" : "Reception of Baraat"}
          </h4>
          <div className="ceremony-time-box">
            <time
              dateTime={`${event.date}T${event.start.slice(0, 2)}:${event.start.slice(2, 4)}:00+05:30`}
            >
              {event.id === "ghurchari" ? "4:00 PM" : "8:30 PM"}
            </time>
          </div>
        </div>
      )}
      <div className="venue-row">
        <div className="venue-copy">
          <strong>{event.venue}</strong>
          {event.detail && <span>{event.detail}</span>}
          <p>{event.address}</p>
        </div>
        <a
          className="venue-directions"
          href={mapUrl(event)}
          target="_blank"
          rel="noreferrer"
          aria-label={`Get directions to ${event.title}`}
        >
          <MapPin size={17} />
          <span>Directions</span>
          <ArrowUpRight size={12} />
        </a>
      </div>
    </div>
  );
}
function EventDate({ event }) {
  return (
    <div className="event-date-box">
      <time dateTime={event.date}>
        {event.day.slice(0, 3)}, {event.num} Dec 2026
      </time>
      {event.id !== "wedding" && <span>{event.time}</span>}
    </div>
  );
}
function App() {
  const invitation = getInvitation(window.location.search);
  const [sound, setSound] = useState(false),
    [musicError, setMusicError] = useState(false),
    [paused, setPaused] = useState(
      () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [copied, setCopied] = useState(false),
    [now, setNow] = useState(Date.now());
  const audio = useRef(null);
  const musicReady = true;
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const player = audio.current;
    if (!player) return;
    player.volume = 0.4;
    let cancelled = false;
    const stopRetrying = () => {
      document.removeEventListener("click", retryOnInteraction);
      document.removeEventListener("keydown", retryOnInteraction);
    };
    const attemptPlayback = () => {
      player
        .play()
        .then(() => {
          if (cancelled) return;
          setMusicError(false);
          stopRetrying();
        })
        .catch((error) => {
          if (
            !cancelled &&
            error.name !== "NotAllowedError" &&
            error.name !== "AbortError"
          )
            setMusicError(true);
        });
    };
    const retryOnInteraction = (event) => {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-music-control]")
      )
        return;
      if (
        event.type === "keydown" &&
        (event.repeat || event.ctrlKey || event.metaKey || event.altKey)
      )
        return;
      attemptPlayback();
    };
    document.addEventListener("click", retryOnInteraction);
    document.addEventListener("keydown", retryOnInteraction);
    player.addEventListener("play", stopRetrying);
    attemptPlayback();
    return () => {
      cancelled = true;
      stopRetrying();
      player.removeEventListener("play", stopRetrying);
    };
  }, []);
  function playMusic() {
    if (musicReady && audio.current) {
      audio.current.volume = 0.4;
      audio.current
        .play()
        .then(() => {
          setSound(true);
          setMusicError(false);
        })
        .catch(() => {
          setSound(false);
          setMusicError(true);
        });
    }
  }
  function toggleMusic() {
    if (sound) {
      audio.current.pause();
      setSound(false);
    } else playMusic();
  }
  const days = Math.max(
    0,
    Math.ceil((new Date("2026-12-11T20:30:00+05:30") - now) / 86400000),
  );
  return (
    <>
      <a className="skip" href="#celebrations">
        Skip to celebrations
      </a>
      {musicReady && (
        <audio
          ref={audio}
          src={asset("media/music.mp3?v=start37")}
          autoPlay
          onPlay={() => setSound(true)}
          onPause={() => setSound(false)}
          loop
          preload="auto"
          onError={() => {
            setSound(false);
            setMusicError(true);
          }}
        />
      )}
      <div>
        <header className="nav">
          <a
            className="monogram"
            href="#home"
            aria-label="Aditya and Jitika home"
          >
            A<span>&</span>J<i>11.12.26</i>
          </a>
        </header>
        <main>
          <section className="hero" id="home">
            <Film name="haldi" paused={paused} />
            <div className="hero-shade" />
            <div className="hero-content">
              <img
                className="ganesh-icon"
                src={asset("ganesh-silver.png")}
                alt="Lord Ganesh"
                width="88"
                height="104"
              />
              <p className="eyebrow">TOGETHER WITH OUR FAMILIES</p>
              <h1>
                Aditya <span>&</span> Jitika
              </h1>
              <p className="hero-subtitle">
                A little destiny. A lifetime of love.
              </p>
              <div className="hero-date">
                <span />
                11 DECEMBER 2026
                <span />
              </div>
              <p className="hero-location">NEW DELHI, INDIA</p>
            </div>
            <div className="hero-foot">
              <span>#AdiKoMilliJit</span>
            </div>
          </section>
          <section className="intro section" id="story">
            <div className="flourish">✧</div>
            <p className="eyebrow">TWO HEARTS. ONE BEAUTIFUL JOURNEY.</p>
            <h2>
              Some things are simply
              <br />
              <em>meant to be.</em>
            </h2>
            <p className="intro-copy">
              With the blessings of the Almighty and our beloved elders,
              <br className="desktop" /> we invite you to be part of our most
              beautiful beginning.
              <br className="desktop" /> Your presence and blessings will make
              our celebrations complete.
            </p>
            <div className="family">
              <div>
                <h3>Aditya</h3>
                <p>S/o Smt. Anju Garg & Shri Rahul Dev Garg</p>
                <small>
                  Grandson of Late Smt. Malti Garg & Late Shri N.C. Garg
                </small>
              </div>
              <span className="family-weds">weds</span>
              <div>
                <h3>Jitika</h3>
                <p>D/o Smt. Santosh Goyal & Shri Vinod Kumar Goyal</p>
              </div>
            </div>
            <div className="countdown">
              <span className="count-number">
                {days.toString().padStart(2, "0")}
              </span>
              <span>
                {days ? "DAYS UNTIL" : "CELEBRATING"}
                <br />
                <strong>our forever</strong>
              </span>
              <span className="count-divider" />
              <span className="count-date">
                11 <i>/</i> 12 <i>/</i> 26
              </span>
            </div>
          </section>
          <section className="celebrations section" id="celebrations">
            <div className="section-heading">
              <div>
                <p className="eyebrow">SAVE THESE LITTLE MOMENTS</p>
                <h2>{invitation.heading}</h2>
              </div>
              <p>
                {invitation.caption}
                <br /> A lifetime to remember.
              </p>
            </div>
            <div className="event-list">
              {events
                .filter((e) => invitation.cards.includes(e.id))
                .map((e) => (
                  <article className={`event event-${e.id}`} key={e.id}>
                    <Film name={e.video} paused={paused} />
                    <div className="event-shade" />
                    <div className="event-panel">
                      <div className="event-header">
                        <h3>{e.title}</h3>
                        <EventDate event={e} />
                      </div>
                      {e.id === "wedding" ? (
                        <>
                          <div className="wedding-schedule">
                            {events
                              .filter((ceremony) => ceremony.date === e.date)
                              .map((ceremony) => (
                                <CeremonyDetails
                                  key={ceremony.id}
                                  event={ceremony}
                                  weddingDay
                                />
                              ))}
                          </div>
                        </>
                      ) : (
                        <CeremonyDetails event={e} />
                      )}
                    </div>
                  </article>
                ))}
            </div>
          </section>
          <section className="details section" id="details">
            <p className="eyebrow">WE LOOK FORWARD TO CELEBRATING WITH YOU</p>
            <h2>RSVP</h2>
            <div className="rsvp-contacts">
              <div className="contact-card">
                <h3>Rahul Dev Garg</h3>
                <p>Swastik India Company, Daryaganj</p>
                <a href="tel:+919716650368">
                  <Phone size={17} /> +91 97166 50368
                </a>
                <a href="tel:+919810860441">
                  <Phone size={17} /> +91 98108 60441
                </a>
              </div>
              <div className="contact-card">
                <h3>Pratyush Garg</h3>
                <a href="tel:+919971038245">
                  <Phone size={17} /> +91 99710 38245
                </a>
                <a href="tel:+917678219286">
                  <Phone size={17} /> +91 76782 19286
                </a>
              </div>
            </div>
          </section>
          <footer>
            <p className="eyebrow">WE CAN’T WAIT TO CELEBRATE WITH YOU</p>
            <p className="footer-names">
              Aditya <em>&</em> Jitika
            </p>
            <button
              className="hashtag"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText("#AdiKoMilliJit");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? (
                <>
                  <Check size={14} /> Copied
                </>
              ) : (
                "#AdiKoMilliJit"
              )}
            </button>
            <div className="footer-bottom">
              <span>{invitation.dateRange} · NEW DELHI</span>
              <span>With Love, The Garg Family</span>
            </div>
          </footer>
        </main>
        <div className="media-controls">
          {musicReady && (
            <button
              data-music-control
              onClick={toggleMusic}
              aria-label={sound ? "Pause music" : "Play music"}
              title={
                musicError
                  ? "Tap to retry music"
                  : sound
                    ? "Pause music"
                    : "Play music"
              }
            >
              {sound ? <Volume2 size={16} /> : <VolumeX size={16} />}
              <span>{sound ? "Music on" : "Music off"}</span>
            </button>
          )}
          <button
            onClick={() => setPaused(!paused)}
            aria-label={
              paused ? "Play background videos" : "Pause background videos"
            }
            title={
              paused ? "Play background videos" : "Pause background videos"
            }
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
        </div>
      </div>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);

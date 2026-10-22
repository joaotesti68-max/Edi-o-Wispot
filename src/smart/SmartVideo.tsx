import {
  AbsoluteFill,
  Audio,
  Composition,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { brand } from "../brand";
import { EndCard } from "../EndCard";
import { fontFamily } from "../loadFont";
import {
  END_FRAMES,
  FPS,
  at,
  clipDurations,
  clipParts,
  clipStarts,
  clips,
  endOf,
  startOf,
  talkFrames,
  totalDurationInFrames,
} from "./edit";
import { Captions } from "./Captions";
import { MonitorMap } from "./MonitorMap";
import { Chip, Flash, GlitchBars, Hook, NotAHacker, glitchShake } from "./Opening";
import {
  AccessLog,
  CompanyAlert,
  FirewallPanel,
  LogoPill,
  NotJustOutside,
  Prepared,
} from "./Panels";
import { Popup, Stamp, TopNote, noteBig, noteSmall } from "./Prints";
import { TalkClip } from "./TalkClip";
import { Sfx, pa } from "./theme";

// Frames where the picture glitches and shakes.
const glitches = [
  at("img9448", 2.22),
  startOf("img9450"),
  at("img9450", 1.0),
  startOf("img9452"),
  startOf("img9467"),
  at("img9467", 1.8),
];
// White flash on the plain cuts.
const flashes = [
  startOf("img9453"),
  startOf("img9461"),
  startOf("img9468"),
  startOf("img9469"),
  startOf("img9470"),
];

// Music sits under the voice and lifts on the end card.
const musicVolume = (f: number) =>
  interpolate(
    f,
    [0, 6, talkFrames - 4, talkFrames + 8, totalDurationInFrames - 20, totalDurationInFrames],
    [0, 0.14, 0.14, 0.38, 0.38, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

const Talk: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = glitchShake(frame, glitches);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake.x}px, ${shake.y}px)` }}>
      {clips.map((c, i) => (
        <Sequence key={c.id} from={clipStarts[i]} durationInFrames={clipDurations[i]}>
          <TalkClip clip={c} parts={clipParts[i]} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const SmartSampaVideo: React.FC = () => {
  const s4 = startOf("img9453");
  const s5 = startOf("img9457");
  const s6 = startOf("img9459");
  const e6 = endOf("img9459");

  return (
    <AbsoluteFill style={{ fontFamily, background: pa.ink }}>
      <Audio src={staticFile("audio/smart/bed.mp3")} volume={musicVolume} />

      <Talk />

      {/* 1 · hook */}
      <Hook
        prefeitura={at("img9448", 0.25)}
        admitiu={at("img9448", 1.38)}
        vazamento={at("img9448", 2.22)}
        smart={at("img9448", 2.94)}
        end={endOf("img9448")}
      />
      <Sfx name="impact" at={at("img9448", 2.22)} volume={0.6} />
      <Sfx name="glitch" at={at("img9448", 2.22)} volume={0.3} />
      <Sfx name="whoosh" at={at("img9448", 2.3)} volume={0.25} />
      <Sfx name="whoosh" at={at("img9448", 2.6)} volume={0.2} />

      {/* 2 · não foi um hacker */}
      <NotAHacker start={at("img9450", 0.3)} strike={at("img9450", 1.0)} end={endOf("img9450")} />
      <Sfx name="glitch" at={startOf("img9450")} volume={0.3} />
      <Sfx name="pop" at={at("img9450", 0.3)} />
      <Sfx name="impact" at={at("img9450", 1.0)} volume={0.45} />

      {/* 3 · mapa do monitoramento (cobre o João) */}
      <MonitorMap
        start={startOf("img9452")}
        end={endOf("img9452")}
        title={at("img9452", 0.4)}
        monitoring={at("img9452", 2.38)}
        faces={at("img9452", 3.56)}
        city={at("img9452", 5.14)}
      />
      <Sfx name="whoosh" at={startOf("img9452")} volume={0.3} />
      <Sfx name="beep" at={at("img9452", 0.5)} volume={0.2} />
      <Chip
        start={at("img9452", 2.3)}
        end={at("img9452", 3.5)}
        icon="camera"
        label="Monitoramento"
        top={1765}
      />
      <Chip
        start={at("img9452", 3.5)}
        end={at("img9452", 5.1)}
        icon="face"
        label="Reconhecimento facial"
        top={1765}
      />
      {[2.3, 3.5].map((t) => (
        <Sfx key={t} name="pop" at={at("img9452", t)} />
      ))}
      {[0, 6, 12].map((d) => (
        <Sfx key={d} name="beep" at={at("img9452", 3.56) + d} volume={0.3} />
      ))}
      <Sfx name="impact" at={at("img9452", 5.14)} volume={0.4} />

      {/* 4–6 · as matérias, em pop-ups sobre o João */}
      <Popup
        src="smart/jovempan.jpg"
        url="jovempan.com.br"
        crop={[380, 640]}
        width={920}
        top={1215}
        rotate={-2}
        highlights={[
          {
            start: at("img9453", 0.9),
            lines: [
              [970, 515, 115, 90],
              [40, 605, 535, 90],
            ],
          },
        ]}
        enter={s4 + 1}
        exit={s5 + 2}
      />
      <TopNote start={at("img9453", 0.9)} end={s5} icon="camera">
        <div style={noteBig}>+50 mil câmeras</div>
        <div style={noteSmall}>espalhadas pela cidade</div>
      </TopNote>
      <Sfx name="pop" at={s4 + 1} volume={0.4} />
      <Sfx name="pop" at={at("img9453", 0.9)} />

      <Popup
        src="smart/g1.jpg"
        url="g1.globo.com"
        crop={[0, 840]}
        width={780}
        top={1205}
        x={-50}
        rotate={-3}
        dark
        enter={s5}
        exit={e6}
      />
      <Popup
        src="smart/g1.jpg"
        url="g1.globo.com"
        crop={[930, 570]}
        width={880}
        top={1350}
        x={40}
        rotate={2}
        dark
        highlights={[
          {
            start: at("img9457", 1.75),
            lines: [
              [350, 1340, 730, 72],
              [80, 1420, 230, 72],
            ],
          },
          {
            start: at("img9459", 0.8),
            lines: [
              [365, 1260, 585, 72],
              [80, 1340, 225, 72],
            ],
          },
        ]}
        enter={at("img9457", 1.5)}
        exit={e6}
      />
      <Sfx name="pop" at={s5} volume={0.4} />
      <Sfx name="pop" at={at("img9457", 1.5)} volume={0.4} />
      <TopNote start={at("img9457", 0.5)} end={s6} icon="user" tone="red">
        <div style={noteBig}>Um servidor</div>
        <div style={noteSmall}>publicou os dados na internet</div>
      </TopNote>
      <Stamp start={at("img9457", 3.65)} end={s6 + 20} label="ILEGAL" top={1420} />
      <Sfx name="impact" at={at("img9457", 3.65)} volume={0.5} />
      <TopNote start={at("img9459", 1.2)} end={e6} icon="building">
        <div style={{ ...noteBig, fontSize: 52, textTransform: "none" }}>
          “Não houve falha na plataforma”
        </div>
        <div style={noteSmall}>— Prefeitura de SP</div>
      </TopNote>
      <Sfx name="pop" at={at("img9459", 1.2)} />

      {/* 7 · sua empresa */}
      <CompanyAlert
        pulse={at("img9461", 0.7)}
        line={at("img9461", 1.6)}
        company={at("img9461", 2.75)}
        end={endOf("img9461")}
      />
      <Sfx name="pop" at={at("img9461", 1.6)} />
      <Sfx name="impact" at={at("img9461", 2.75)} volume={0.5} />

      {/* 8 · firewall */}
      <FirewallPanel
        start={startOf("img9467")}
        inside={at("img9467", 1.1)}
        verdict={at("img9467", 2.05)}
        end={endOf("img9467")}
      />
      <Sfx name="glitch" at={startOf("img9467")} volume={0.25} />
      <Sfx name="impact" at={at("img9467", 2.05)} volume={0.5} />
      <Sfx name="glitch" at={at("img9467", 2.05)} volume={0.25} />

      {/* 9 · não é só de fora */}
      <NotJustOutside
        security={at("img9468", 0.5)}
        notOnly={at("img9468", 1.25)}
        outside={at("img9468", 1.95)}
        end={endOf("img9468")}
      />
      {[0.5, 1.25, 1.95].map((t) => (
        <Sfx key={t} name="pop" at={at("img9468", t)} volume={0.3} />
      ))}

      {/* 10 · quem acessa o quê */}
      <AccessLog
        start={startOf("img9469")}
        end={endOf("img9469")}
        rows={[
          { at: at("img9469", 1.3), who: "ana.souza", what: "Câmeras · Zona Sul" },
          { at: at("img9469", 1.95), who: "rh.marcos", what: "Folha de pagamento" },
          { at: at("img9469", 2.85), who: "srv.0427", what: "Exportou base inteira", alert: true },
        ]}
      />
      <Sfx name="whoosh" at={startOf("img9469")} volume={0.25} />
      {[1.3, 1.95, 2.85].map((t) => (
        <Sfx key={t} name="typing" at={at("img9469", t)} volume={0.4} />
      ))}
      <Sfx name="beep" at={at("img9469", 3.3)} volume={0.4} />

      {/* 11 · preparada? */}
      <Prepared start={at("img9470", 0.7)} prepared={at("img9470", 1.4)} end={endOf("img9470")} />
      <Sfx name="pop" at={at("img9470", 0.7)} />
      <Sfx name="impact" at={at("img9470", 1.4)} volume={0.35} />

      {/* 12 · fale com a Pro Advanced */}
      <LogoPill start={at("img9471", 0.75)} end={endOf("img9471") + 2} />
      <Sfx name="riser" at={endOf("img9471") - 28} volume={0.3} />
      <Sfx name="pop" at={at("img9471", 0.75)} volume={0.4} />

      <Captions />
      <GlitchBars hits={glitches} />
      <Flash at={flashes} />

      <Sequence from={talkFrames} durationInFrames={END_FRAMES}>
        <EndCard
          background={brand.manualGradient}
          siteColor={brand.colors.white}
          siteBackground={pa.ink}
          cta="Sua empresa está preparada?"
        />
      </Sequence>
      <Sfx name="impact" at={talkFrames} volume={0.4} />
    </AbsoluteFill>
  );
};

export const SmartSampaComposition = () => (
  <Composition
    id="SmartSampa"
    component={SmartSampaVideo}
    durationInFrames={totalDurationInFrames}
    fps={FPS}
    width={1080}
    height={1920}
  />
);

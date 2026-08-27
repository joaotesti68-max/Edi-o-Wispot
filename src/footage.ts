// GERADO por scripts/prepare-footage.mjs — não editar à mão.
// Rode `npm run footage` depois de trocar os arquivos em footage/raw/.
export type FootageSegment = { trimBefore: number; trimAfter: number };

export type FootageClip = {
  id: string;
  source: string;
  file: string;
  durationInFrames: number;
  segments: FootageSegment[];
};

export const footage: Record<string, FootageClip> = {
  "standin-abertura": {
    "id": "standin-abertura",
    "source": "standin-abertura.mov",
    "file": "videos/standin-abertura.mp4",
    "durationInFrames": 129,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 42
      },
      {
        "trimBefore": 59,
        "trimAfter": 129
      }
    ]
  },
  "standin-fechamento": {
    "id": "standin-fechamento",
    "source": "standin-fechamento.mov",
    "file": "videos/standin-fechamento.mp4",
    "durationInFrames": 154,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 154
      }
    ]
  },
  "standin-prazo": {
    "id": "standin-prazo",
    "source": "standin-prazo.mov",
    "file": "videos/standin-prazo.mp4",
    "durationInFrames": 175,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 75
      },
      {
        "trimBefore": 98,
        "trimAfter": 175
      }
    ]
  },
  "standin-risco": {
    "id": "standin-risco",
    "source": "standin-risco.mov",
    "file": "videos/standin-risco.mp4",
    "durationInFrames": 244,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 244
      }
    ]
  },
  "standin-time": {
    "id": "standin-time",
    "source": "standin-time.mov",
    "file": "videos/standin-time.mp4",
    "durationInFrames": 305,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 124
      },
      {
        "trimBefore": 151,
        "trimAfter": 305
      }
    ]
  }
};

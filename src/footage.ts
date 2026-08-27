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
  "img-7949": {
    "id": "img-7949",
    "source": "IMG_7949.MOV",
    "file": "videos/img-7949.mp4",
    "durationInFrames": 327,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 327
      }
    ]
  },
  "img-7952": {
    "id": "img-7952",
    "source": "IMG_7952.MOV",
    "file": "videos/img-7952.mp4",
    "durationInFrames": 125,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 125
      }
    ]
  },
  "img-7954": {
    "id": "img-7954",
    "source": "IMG_7954.MOV",
    "file": "videos/img-7954.mp4",
    "durationInFrames": 114,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 115
      }
    ]
  },
  "img-7956": {
    "id": "img-7956",
    "source": "IMG_7956.MOV",
    "file": "videos/img-7956.mp4",
    "durationInFrames": 168,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 168
      }
    ]
  },
  "img-7958": {
    "id": "img-7958",
    "source": "IMG_7958.MOV",
    "file": "videos/img-7958.mp4",
    "durationInFrames": 165,
    "segments": [
      {
        "trimBefore": 40,
        "trimAfter": 149
      }
    ]
  },
  "img-7959": {
    "id": "img-7959",
    "source": "IMG_7959.MOV",
    "file": "videos/img-7959.mp4",
    "durationInFrames": 81,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 81
      }
    ]
  },
  "img-7960": {
    "id": "img-7960",
    "source": "IMG_7960.MOV",
    "file": "videos/img-7960.mp4",
    "durationInFrames": 100,
    "segments": [
      {
        "trimBefore": 20,
        "trimAfter": 82
      }
    ]
  },
  "img-7963": {
    "id": "img-7963",
    "source": "IMG_7963.MOV",
    "file": "videos/img-7963.mp4",
    "durationInFrames": 134,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 134
      }
    ]
  }
};

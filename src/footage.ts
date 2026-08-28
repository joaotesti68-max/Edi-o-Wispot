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
    "durationInFrames": 303,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 194
      },
      {
        "trimBefore": 200,
        "trimAfter": 303
      }
    ]
  },
  "img-7952": {
    "id": "img-7952",
    "source": "IMG_7952.MOV",
    "file": "videos/img-7952.mp4",
    "durationInFrames": 117,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 117
      }
    ]
  },
  "img-7954": {
    "id": "img-7954",
    "source": "IMG_7954.MOV",
    "file": "videos/img-7954.mp4",
    "durationInFrames": 108,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 108
      }
    ]
  },
  "img-7956": {
    "id": "img-7956",
    "source": "IMG_7956.MOV",
    "file": "videos/img-7956.mp4",
    "durationInFrames": 156,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 156
      }
    ]
  },
  "img-7958": {
    "id": "img-7958",
    "source": "IMG_7958.MOV",
    "file": "videos/img-7958.mp4",
    "durationInFrames": 153,
    "segments": [
      {
        "trimBefore": 37,
        "trimAfter": 139
      }
    ]
  },
  "img-7959": {
    "id": "img-7959",
    "source": "IMG_7959.MOV",
    "file": "videos/img-7959.mp4",
    "durationInFrames": 77,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 77
      }
    ]
  },
  "img-7960": {
    "id": "img-7960",
    "source": "IMG_7960.MOV",
    "file": "videos/img-7960.mp4",
    "durationInFrames": 93,
    "segments": [
      {
        "trimBefore": 19,
        "trimAfter": 77
      }
    ]
  },
  "img-7963": {
    "id": "img-7963",
    "source": "IMG_7963.MOV",
    "file": "videos/img-7963.mp4",
    "durationInFrames": 126,
    "segments": [
      {
        "trimBefore": 0,
        "trimAfter": 126
      }
    ]
  }
};

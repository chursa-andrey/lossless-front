import type { TFunction } from 'i18next';
import { z } from 'zod';

import { TRACK_GENRES } from '@/features/tracks/config/genres';
import type { UploadTrackFile } from '@/features/tracks/types/uploadTrack';

const AUDIO_FILE_EXTENSIONS = ['wav', 'flac'] as const;

function getFileExtension(fileName: string | null | undefined) {
  const extension = fileName?.split('.').pop()?.toLowerCase();
  return extension ?? '';
}

function isSupportedAudioFile(file: UploadTrackFile | null) {
  if (!file) {
    return false;
  }

  if (file.hasRequestedType === false) {
    return false;
  }

  return AUDIO_FILE_EXTENSIONS.includes(getFileExtension(file.name) as (typeof AUDIO_FILE_EXTENSIONS)[number]);
}

function optionalText(maxLength: number, message: string) {
  return z.string().trim().max(maxLength, message);
}

export function createUploadTrackSchema(t: TFunction) {
  return z.object({
    trackFile: z
      .custom<UploadTrackFile | null>()
      .refine(file => Boolean(file), t('uploadTrack.validation.trackRequired'))
      .refine(isSupportedAudioFile, t('uploadTrack.validation.trackFormat')),
    genre: z.enum(TRACK_GENRES, {
      error: t('uploadTrack.validation.genreRequired'),
    }),
    trackTitle: optionalText(160, t('uploadTrack.validation.textMax')),
    artistName: optionalText(160, t('uploadTrack.validation.textMax')),
    albumTitle: optionalText(160, t('uploadTrack.validation.textMax')),
    purchaseLinks: z.array(
      z.object({
        url: z
          .string()
          .trim()
          .max(2048, t('uploadTrack.validation.linkMax'))
          .refine(value => value.length === 0 || z.url().safeParse(value).success, {
            message: t('uploadTrack.validation.linkInvalid'),
          }),
      }),
    ),
  });
}

export type UploadTrackFormValues = z.infer<ReturnType<typeof createUploadTrackSchema>>;

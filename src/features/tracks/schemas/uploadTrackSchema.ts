import type { TFunction } from 'i18next';
import { z } from 'zod';

import type { UploadTrackFile } from '@/features/tracks/types/uploadTrack';

const AUDIO_FILE_EXTENSIONS = ['wav', 'flac'] as const;
export const MAX_PURCHASE_LINKS = 10;

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

function isHttpUrl(value: string) {
  const result = z.url().safeParse(value);
  return result.success && /^https?:\/\//i.test(value);
}

export function createUploadTrackSchema(t: TFunction, availableGenreSlugs: string[] = []) {
  return z.object({
    trackFile: z
      .custom<UploadTrackFile | null>()
      .refine(file => Boolean(file), t('uploadTrack.validation.trackRequired'))
      .refine(isSupportedAudioFile, t('uploadTrack.validation.trackFormat')),
    genre: z
      .string()
      .trim()
      .min(1, t('uploadTrack.validation.genreRequired'))
      .refine(
        value => availableGenreSlugs.length === 0 || availableGenreSlugs.includes(value),
        t('uploadTrack.validation.genreRequired'),
      ),
    trackTitle: optionalText(255, t('uploadTrack.validation.textMax')),
    artistName: optionalText(255, t('uploadTrack.validation.textMax')),
    albumTitle: optionalText(255, t('uploadTrack.validation.textMax')),
    purchaseLinks: z
      .array(
        z.object({
          url: z
            .string()
            .trim()
            .max(2048, t('uploadTrack.validation.linkMax'))
            .refine(value => value.length === 0 || isHttpUrl(value), {
              message: t('uploadTrack.validation.linkInvalid'),
            }),
        }),
      )
      .max(MAX_PURCHASE_LINKS, t('uploadTrack.validation.linkLimit')),
  });
}

export type UploadTrackFormValues = z.infer<ReturnType<typeof createUploadTrackSchema>>;

/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setRspack(true);
// PNG, not the default JPEG: the frames are an intermediate that gets encoded
// again, and a JPEG generation there costs quality for nothing but render time.
// It also keeps the output on yuv420p instead of the full-range yuvj420p tag.
Config.setVideoImageFormat("png");
Config.setCrf(13);
Config.setX264Preset("veryslow");
Config.setAudioBitrate("320k");
Config.setOverwriteOutput(true);
Config.overrideBundlerConfig(enableTailwind);

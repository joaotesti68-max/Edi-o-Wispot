#!/bin/bash
# usage: soft.sh in out [extra ffmpeg args]
in=$1; out=$2; shift 2
ffmpeg -v error -y -i "$in" -filter_complex "
[0:v]format=yuv444p,split=3[orig][tosmooth][tomask];
[tosmooth]bilateral=sigmaS=12:sigmaR=0.10:planes=1,bilateral=sigmaS=6:sigmaR=0.08:planes=1[smooth];
[tomask]extractplanes=u+v[u][v];
[u]lut=y='if(between(val,85,128),255,0)'[um];
[v]lut=y='if(between(val,135,175),255,0)'[vm];
[um][vm]blend=all_mode=multiply,gblur=sigma=8,lut=y='val*0.7'[mask];
[orig][smooth][mask]maskedmerge=planes=1,format=yuv420p[outv]" -map "[outv]" "$@" "$out"

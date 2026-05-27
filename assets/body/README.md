# Body figure assets

Four PNG files power the `BodyMap` silhouettes. Drop them in this folder with these exact names:

```
female_front.png
female_back.png
male_front.png
male_back.png
```

If a file is missing the BodyMap falls back to its built-in SVG silhouette (no crash), so you can ship images one at a time.

## Spec — every image must match

| Spec | Value |
|---|---|
| Canvas | 1000 × 1900 px (aspect ratio 10:19) |
| Format | PNG with transparent background |
| Body fill | `#2E1870` (deep violet) |
| Body outline | `#9B8BF4`, stroke 6 px |
| Inner detail lines | `#7456D4`, stroke 2 px, 40 % opacity (optional — clavicle, ab lines, knee creases) |
| Pose | Standing T-pose-ish; arms held ~15° away from body so the forearm/wrist hotspots are reachable |
| Front view | Head facing forward, looking at camera (only the head silhouette implies "front") |
| Back view | Same body posture, but the head is turned (you see the back of the head, no face) |
| Lighting | None — pure silhouette, no shading, no gradients, no shadows inside the body |
| Background | Fully transparent. No floor, no shadow under the feet |
| Centering | Body horizontally centered. Top of head at y ≈ 100 px; soles of feet at y ≈ 1800 px |
| Symmetry | Mirror-symmetric — the left half is the mirror of the right half |
| Proportions | Realistic adult anatomy (not stylized / cartoon) — 7.5–8 heads tall |

The 10:19 ratio matches the existing SVG viewBox (`0 0 200 380`) so the hotspot zone coordinates in `BodyMap.jsx` still line up. **Do not change the aspect ratio** unless you also want to recalibrate every PAIN_ZONES entry.

## AI prompts that produced good results

Run these in Midjourney, DALL·E 3, or Imagen. Iterate until you get a clean silhouette — be ready to do 5–10 generations per image.

### Female · Front

```
Front-view anatomical silhouette of an adult female body, full body from head to toes, standing straight, feet shoulder-width apart, arms held about fifteen degrees away from the torso, palms facing forward.

Style: pure silhouette, solid fill colour #2E1870 (deep violet), 6px outline colour #9B8BF4 (light violet), transparent background, no shading, no gradients, no shadows inside the body, no clothing, no facial features, no hair detail — just the outline of a head.

Realistic adult proportions, roughly 7.5 heads tall. The body is mirror-symmetric. Centered in a 1000 by 1900 pixel canvas, top of head about 100px from the top edge, feet ending about 100px above the bottom edge.

Minimal flat illustration, vector style, clean edges, no photographic detail.
```

### Female · Back

Same as Female Front, with this change:

```
…back view of the same female silhouette. You see the back of the head (no face), back of the shoulders, spine area, glutes, back of the thighs and calves. Arms still held about fifteen degrees away from the torso; you see the back of the forearms and hands.
```

### Male · Front

Same as Female Front, with this change:

```
…adult male body, with broader shoulders and a narrower waist-to-hip ratio than the female version. Same pose, same colours, same 1000×1900 canvas.
```

### Male · Back

Combine the male front instructions with the back view instructions.

## After generation

1. Crop / pad each image to **exactly 1000×1900 px**.
2. Make sure the background is **fully transparent** (no off-white halo). If you see a light edge, re-export with "background: transparent" enabled, or use Photoshop / Photopea to delete the background.
3. Save as `female_front.png`, `female_back.png`, `male_front.png`, `male_back.png` in this folder.
4. Re-run the Expo app — the BodyMap will pick them up automatically.

## Hotspot calibration

The pain zones (neck, shoulders, lower back, knees, etc.) are coordinates inside the 200×380 viewBox. If the AI-generated bodies have proportions that differ noticeably from the placeholder SVG, you'll see hotspots sitting slightly off the right anatomy. In that case:

1. Open `src/components/BodyMap.jsx`.
2. Find `PAIN_ZONES.front` and `PAIN_ZONES.back`.
3. Each entry has `{ id, label, cx, cy, rx, ry }` — `cx`/`cy` are the centre of the hotspot inside the 200×380 box. Nudge them until they land on the right body part.

(Or ask Claude to recalibrate after you drop the new images.)

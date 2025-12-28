# Splash Screen Setup Guide

## 🎬 What's Been Implemented

A video-based splash screen that plays automatically when your app opens and then navigates to the login page.

## 📁 Where to Add Your Video/GIF

Place your splash screen file(s) in the `angular_app/public/assets/` folder:

### Option 1: Video (RECOMMENDED) ✅
```
angular_app/public/assets/splash.mp4
angular_app/public/assets/splash.webm  (optional, for better browser support)
```

### Option 2: Animated GIF (Fallback)
```
angular_app/public/assets/splash.gif
```

## 🎥 Video Specifications (Recommended)

- **Format**: MP4 (H.264 codec)
- **Duration**: 2-4 seconds (keep it short!)
- **Resolution**: 1080x1920 (portrait) or 1920x1080 (landscape)
- **File Size**: Under 2MB for faster loading
- **Frame Rate**: 30fps or 60fps

### Creating Your Video

1. **Use a video editor** (Adobe Premiere, Final Cut, DaVinci Resolve, etc.)
2. **Export settings**:
   - Format: MP4
   - Codec: H.264
   - Quality: High (but compress to <2MB)
   - Audio: None (remove audio track to save space)

### Converting Video Format

```bash
# Using FFmpeg (install from ffmpeg.org)
ffmpeg -i your-video.mov -c:v libx264 -crf 23 -preset medium -an splash.mp4

# For WebM version (optional)
ffmpeg -i your-video.mov -c:v libvpx-vp9 -crf 30 -b:v 0 -an splash.webm
```

## 🖼️ Using GIF Instead

If you prefer GIF:
1. Create an animated GIF (max 2MB recommended)
2. Save it as `angular_app/public/assets/splash.gif`
3. Update the HTML to use GIF:

```html
<!-- In splash-screen.html, replace the video element with: -->
<img src="assets/splash.gif" alt="Loading..." class="splash-video">
```

## ⚙️ Customization Options

### Change Video Duration Timeout

Edit `splash-screen.ts`:
```typescript
setTimeout(() => {
  this.navigateToLogin();
}, 5000); // Change 5000 to your desired milliseconds
```

### Remove Skip Button

Edit `splash-screen.html` - delete these lines:
```html
<button class="skip-button" (click)="skipSplash()">
  Skip
</button>
```

### Remove Loading Spinner

Edit `splash-screen.html` - delete these lines:
```html
<div class="loading-indicator">
  <div class="spinner"></div>
</div>
```

### Change Background Color

Edit `splash-screen.css`:
```css
.splash-container {
  background-color: #ffffff; /* Change to your brand color */
}
```

### Change Video Fit

Edit `splash-screen.css`:
```css
.splash-video {
  object-fit: contain; /* Options: contain, cover, fill, scale-down */
}
```

- **contain**: Fits entire video within screen (may show bars)
- **cover**: Fills entire screen (may crop video)
- **fill**: Stretches to fill screen

## 🧪 Testing

1. **Add your video file** to `public/assets/`
2. **Run the app**:
   ```bash
   npm start
   ```
3. Navigate to `http://localhost:4200` - you should see the splash screen

## 📱 Mobile Build

For Android build, the video file will be automatically included in the APK:

```bash
npm run build:mobile
cd android
./gradlew assembleDebug
```

## 🎨 Design Tips

1. **Keep it short**: 2-4 seconds max
2. **Brand focused**: Show your logo/brand
3. **Smooth animation**: No jarring movements
4. **Professional**: Match your app's design language
5. **Optimize size**: Compress to reduce app size

## 🐛 Troubleshooting

### Video not playing?
- Check file path: `public/assets/splash.mp4`
- Verify video format (MP4, H.264 codec)
- Check browser console for errors
- Try opening video file directly in browser

### Video too long?
- Reduce video duration in editor
- Lower quality/resolution
- Use HandBrake or FFmpeg to compress

### Black screen?
- Check that video file exists
- Verify video format is supported
- Check background color matches video

## 📚 Resources

- **FFmpeg**: https://ffmpeg.org/download.html
- **HandBrake** (video compression): https://handbrake.fr/
- **Free video editors**: DaVinci Resolve, Shotcut, OpenShot
- **GIF makers**: GIPHY, EZGif, Adobe Photoshop

---

## Quick Start Checklist

- [ ] Create or obtain your animated video/GIF
- [ ] Optimize video to <2MB
- [ ] Save as `public/assets/splash.mp4`
- [ ] Test locally: `npm start`
- [ ] Customize timing/colors as needed
- [ ] Build and test on mobile device

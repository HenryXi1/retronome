# Retronome 🎶

## Inspiration

As two students from Vancouver who study far from home in Waterloo, we’re always searching for creative ways to stay connected with the people we care about. We noticed a TikTok trend where couples would record short clips, then reverse them, and attempt to mimic the reversed playback. The results were hilarious — but the experience was limited to local play and not built for online social settings.

That sparked an idea: what if we could take this quirky concept and give it the **multiplayer, party-game treatment**, similar to popular games like Skribbl or Gartic Phone? We wanted to create something that lets anyone — friends, family, or even complete strangers — connect over shared laughter, music, and the universal challenge of trying to make sense of backwards audio.

And so, **Retronome** was born. It is our attempt to transform a viral local challenge into a polished, real-time multiplayer game that can bridge distance and create moments of pure comedy.

---

## What it does

**Retronome** is a multiplayer party game that turns reversed audio into a chaotic guessing challenge.

Here’s how it works:

1. **Record:** Players take turns recording a short audio snippet — singing a song lyric, humming a tune, or saying a funny phrase.
2. **Reverse:** The recording is instantly reversed and sent to other players.
3. **Mimic:** Players attempt to sing or say the reversed version as accurately as possible.
4. **Reveal:** Retronome re-reverses the mimic, playing it back side-by-side with the original. The results are always surprising — sometimes close, sometimes unrecognizable, but always funny.

### Game Modes

- **Local Play:** Two people can share one device and take turns recording and guessing.
- **Online Multiplayer:** Play with up to 8+ people. Everyone starts by recording their own audio, then clips are scrambled between players in a “telephone-style” chain. At the end, you can replay how each clip transformed across multiple reversals.

### Key Features

- 🎤 **Real-time multiplayer gameplay** powered by WebSockets
- 🔄 **Audio recording, reversal, and playback** with consistent quality
- 📡 **Room-based lobbies** for quick matchmaking using short codes
- ⏱️ **Timed rounds and automatic phase transitions** for smooth game flow
- 📱 **Cross-platform compatibility** on desktop and mobile devices
- 🎉 **Results recap** so players can hear and laugh at the progression of their clips

---

## How we built it

### Frontend (React + TypeScript)

- Built using **React** with **TypeScript** for a type-safe, modern development workflow
- **Ant Design** for polished, consistent UI components and responsive design
- Real-time updates with **WebSocket connections** to the backend
- **Vite** for fast hot-reload and optimized builds for deployment
- Mobile-first design to ensure it works smoothly on phones, tablets, and desktops

### Backend (FastAPI + Python)

- **FastAPI** server for both RESTful APIs and WebSocket endpoints that can natively handle audio files
- **Redis** for real-time state management and pub/sub messaging as event updates
- Audio processing with **PyDub** to reverse and manipulate audio clips
- Integration with **cloud storage (S3-compatible)** for audio persistence
- WebSocket-based game controller to handle:
  - Room creation and joining
  - Automatic round timers
  - State synchronization across multiple clients

### Technical Highlights

- **WebSocket synchronization:** Low-latency communication for smooth multiplayer
- **Redis pub/sub:** Efficient, scalable handling of concurrent rooms and game states
- **Audio encoding & transfer:** Handling base64 audio safely without quality loss
- **Resilient architecture:** Automatic handling of player disconnections and reconnections
- **Scalable design:** Room-based game flow ensures the system can expand to large groups

---

## Challenges we ran into

- **Real-time synchronization:** Ensuring all players were on the same round and timer, even with network lag or reconnections.
- **Audio processing:** Handling different audio formats across browsers (WebM, OGG, MP4) while ensuring smooth reversal and playback.
- **File transmission:** Balancing speed and quality when sending audio data between clients and the backend.
- **State complexity:** Designing a robust state manager to coordinate multiple players, rounds, and transitions simultaneously.
- **Cross-browser quirks:** Safari, Firefox, and Chrome all handle audio recording differently, requiring careful testing and fallbacks.
- **Reliability:** Handling disconnections gracefully so players don’t get stuck in broken game states.

---

## Accomplishments we’re proud of

- ⚡ Built a **real-time multiplayer system** that feels smooth and responsive
- 🎶 Successfully implemented **audio reversal and re-reversal** while maintaining clarity
- 🏗️ Created a **clean, modular architecture** that separates frontend, backend, and state management
- 🎨 Delivered a **user-friendly design** that’s intuitive for first-time players
- 🔄 Achieved **perfect synchronization** between multiple players in the same room
- 📱 Verified **cross-platform support** across browsers and devices

---

## What we learned

- **Deep dive into WebSockets:** How to design real-time communication patterns and handle concurrency.
- **Audio engineering basics:** Formats, codecs, and using libraries like PyDub for efficient processing.
- **Redis for real-time systems:** Leveraging pub/sub and in-memory state for multiplayer games.
- **Scalable state management:** Keeping multiplayer games consistent despite disconnects and edge cases.
- **UX for social games:** How to make technical complexity invisible so the experience stays lighthearted and fun.

---

## What’s next for Retronome

### Enhanced Features

- 🎲 Custom game modes with new rules and challenges
- 📊 Player stats, leaderboards, and achievements
- 🎤 Integrated **voice chat** for live banter between players

### Technical Improvements

- ⚡ Optimized audio compression for faster transfers
- 🎵 Support for longer clips and additional audio formats
- 🛡️ Stronger error handling and reconnection logic
- 🚀 Performance tuning for larger multiplayer lobbies

### Social Features

- 👥 Friend lists and private room systems
- 📼 Replay sharing and highlight reels for funny moments
- 🏆 Tournament-style modes for competitive play
- 📱 Social media integration for easy clip sharing

### Accessibility

- 🌎 Multi-language and accent support for inclusivity
- 👀 Visual indicators and subtitles for hearing-impaired players
- ⌨️ Full keyboard navigation for accessibility compliance

---

## Final Thoughts

Retronome takes a simple viral trend — reversing audio — and transforms it into a full-fledged, online multiplayer experience. It combines technical challenges like real-time synchronization, audio processing, and scalable architecture with the universal appeal of party games.

Whether you’re across the room or across the world, Retronome connects people through laughter, music, and the delightful chaos of backwards speech. We’re excited to continue developing it and can’t wait to see the joy it brings to players everywhere.

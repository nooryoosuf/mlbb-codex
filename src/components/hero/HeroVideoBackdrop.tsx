"use client";

export default function HeroVideoBackdrop() {
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute inset-0 bg-background opacity-60 mix-blend-multiply z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-[2]" />

            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-50 grayscale contrast-[1.2]"
            >
                <source src="https://static.vecteezy.com/system/resources/previews/001/803/740/mp4/futuristic-scifi-glowing-hud-element-free-video.mp4" type="video/mp4" />
            </video>

            <div className="absolute inset-0 z-[3] opacity-10 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:100px_100px] pointer-events-none" />
        </div>
    );
}

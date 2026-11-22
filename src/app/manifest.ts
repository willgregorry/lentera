import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lentera — Pendampingan Lansia",
    short_name: "Lentera",
    description:
      "Platform pemantauan kesehatan lansia di rumah, rekrutmen caregiver terverifikasi, dan respon darurat SOS 119.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#FFFFFF",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/images/icons/lentera-icon.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/images/lentera_mascot.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}

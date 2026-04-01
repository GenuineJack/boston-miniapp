import { Metadata } from "next";
import { CityBuilderPage } from "@/features/city-builder/city-builder-page";

export const metadata: Metadata = {
  title: "City Builder — Build a Mini-App for Your City",
  description:
    "Everything you need to launch a Farcaster community mini-app for your hometown. Fork, configure, deploy.",
  openGraph: {
    title: "City Builder — Build a Mini-App for Your City",
    description:
      "Fork the template, let AI research your city, and deploy a community mini-app in one session.",
  },
};

export default function CityBuilderRoute() {
  return <CityBuilderPage />;
}

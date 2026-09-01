import { RathinamHero } from "@/components/sections/RathinamHero";
import { AboutEvent } from "@/components/sections/AboutEvent";
import { TEDxArrival } from "@/components/sections/TEDxArrival";
import { Speakers } from "@/components/sections/Speakers";
import { TeamCredits } from "@/components/sections/TeamCredits";
import { Tickets } from "@/components/sections/Tickets";
import { Finale } from "@/components/sections/Finale";

export default function Home() {
  return (
    <>
      <RathinamHero />
      <AboutEvent />
      <TEDxArrival />
      <Speakers />
      <TeamCredits />
      <Tickets />
      <Finale />
    </>
  );
}

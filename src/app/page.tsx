import { RathinamHero } from "@/components/sections/RathinamHero";
import { AboutEvent } from "@/components/sections/AboutEvent";
import { TEDxArrival } from "@/components/sections/TEDxArrival";
import { Speakers } from "@/components/sections/Speakers";
import { TeamCredits } from "@/components/sections/TeamCredits";
import { Tickets } from "@/components/sections/Tickets";
import { Finale } from "@/components/sections/Finale";
import { NoodleTransition } from "@/components/motion/NoodleTransition";

export default function Home() {
  return (
    <>
      <RathinamHero />
      <NoodleTransition />
      <AboutEvent />
      <NoodleTransition />
      <TEDxArrival />
      <NoodleTransition />
      <Speakers />
      <NoodleTransition />
      <TeamCredits />
      <NoodleTransition />
      <Tickets />
      <NoodleTransition />
      <Finale />
    </>
  );
}

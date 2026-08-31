import { RathinamHero } from "@/components/sections/RathinamHero";
import { RathinamExperience } from "@/components/sections/RathinamExperience";
import { TEDxArrival } from "@/components/sections/TEDxArrival";
import { TEDxIntro } from "@/components/sections/TEDxIntro";
import { Speakers } from "@/components/sections/Speakers";
import { TeamCredits } from "@/components/sections/TeamCredits";
import { EventInformation } from "@/components/sections/EventInformation";
import { Finale } from "@/components/sections/Finale";

export default function Home() {
  return (
    <>
      <RathinamHero />
      <RathinamExperience />
      <TEDxArrival />
      <TEDxIntro />
      <Speakers />
      <TeamCredits />
      <EventInformation />
      <Finale />
    </>
  );
}

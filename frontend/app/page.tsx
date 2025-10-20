import { Appbar } from "@/component/Appbar";
import { Hero } from "@/component/Hero";
import { HeroVedio } from "@/component/HeroVideo";


export default function Home() {
  return (
    <main className="">
      <Appbar />
      <Hero />
      <HeroVedio />
    </main>
  )
}

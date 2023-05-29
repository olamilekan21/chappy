import { CTASection, Features, Footer, Hero, Navbar } from "@/features/home";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Chappy</title>
      </Head>
      <div className="mx-auto w-full max-w-7xl">
        <Navbar />

        <main role="main">
          <Hero />
          <Features />
          <CTASection />
        </main>

        <Footer />
      </div>
    </>
  );
}

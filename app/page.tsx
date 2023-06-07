import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Header from "../components/Header";
import SquigglyLines from "../components/SquigglyLines";

export default function HomePage() {
  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 mt-20 lg:background-gradient">
        <a
          href="https://replicate.com/naklecha/fashion-ai"
          target="_blank"
          rel="noreferrer"
          className="border border-gray-700 rounded-lg py-2 px-4 text-gray-400 text-sm mb-5 transition duration-300 ease-in-out"
        >
          Are you a dev? Try the API on{" "}
          <span className="text-pink-500">Replicate</span>
        </a>
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-7xl">
          Modify clothing{" "}
          <span className="relative whitespace-nowrap text-pink-500">
            <SquigglyLines />
            <span className="relative">using AI</span>
          </span>
        </h1>
        <h2 className="mx-auto mt-5 max-w-xl text-lg sm:text-gray-400  text-gray-500 leading-7 font-mono">
          Take a picture of a person, then modify clothing or explore fashion using our AI.
        </h2>
        <Link
          className="bg-pink-500 rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-4 hover:bg-pink-400 transition"
          href="/dream"
        >
          Modify your clothing
        </Link>
        <div className="flex justify-between items-center w-full flex-col sm:mt-10 mt-6 font-mono">
          <div className="flex flex-col space-y-10 mt-4 mb-16">
            <div className="flex sm:space-x-8 sm:flex-row flex-col p-5">
              <div>
                <h3 className="mb-1 font-medium text-lg">Original</h3>
                <Image
                  alt="Generated image with fashionAI.me"
                  src="/original-pic.png"
                  className="w-full object-cover h-96 rounded-2xl"
                  width={400}
                  height={400}
                />
              </div>
              <div className="sm:mt-0 mt-8">
                <h3 className="mb-1 font-medium text-lg">Detected Clothing Mask</h3>
                <Image
                  alt="Generated image with fashionAI.me"
                  width={400}
                  height={400}
                  src="/mask.png"
                  className="w-full object-cover h-96 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
              <div className="sm:mt-0 mt-8">
                <h3 className="mb-1 font-medium text-lg">Mask Over Original</h3>
                <Image
                  alt="Generated image with fashionAI.me"
                  width={400}
                  height={400}
                  src="/masked_img.png"
                  className="w-full object-cover h-96 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
              <div className="sm:mt-0 mt-8">
                <h3 className="mb-1 font-medium text-lg">"flower patterns shirt"</h3>
                <Image
                  alt="Generated image with fashionAI.me"
                  width={400}
                  height={400}
                  src="/generated-pic.png"
                  className="w-full object-cover h-96 rounded-2xl sm:mt-0 mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

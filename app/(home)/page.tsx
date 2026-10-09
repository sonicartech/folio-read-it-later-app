"use client";

import { docsCards } from "@/lib/docs";
import { SearchInput, useSearchDialog } from "@/components/search-input";
import { AISearchTrigger } from "@/components";
import { Bot, Search } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaTiktok,
  FaXTwitter,
} from "react-icons/fa6";

import Link from "next/link";

const socialLinks = [
  { icon: FaFacebook, href: "https://facebook.com" },
  { icon: FaXTwitter, href: "https://x.com" },
  { icon: FaInstagram, href: "https://instagram.com" },
  { icon: FaTelegram, href: "https://t.me" },
  { icon: FaTiktok, href: "https://tiktok.com" },
  { icon: FaLinkedin, href: "https://linkedin.com" },
];

export default function HomePage() {
  const { setOpen, SearchDialog } = useSearchDialog();

  return (
    <main className="pt-12">
      <div className="pt-24 flex justify-center items-center flex-col gap-4">
        <h1 className="mb-4 text-6xl font-bold text-center">
          How can we help you?
        </h1>

        <SearchInput />

        <div className="flex gap-4 mt-[24px] flex-wrap justify-center">
          <button
            className="border-2 border-[#A8F4FD99] py-4 px-8 rounded-full bg-[#008F9F] text-white dark:text-black font-semibold flex justify-center gap-3 cursor-pointer hover:opacity-95  transition-all"
            onClick={() => setOpen(true)}
          >
            <Search />
            <span>Search Now</span>
          </button>
          <AISearchTrigger className="border-2  borded-[#008F9F] py-4 px-8 rounded-full bg-[#008F9F33] flex justify-center gap-3 cursor-pointer hover:opacity-95  transition-all  font-semibold">
            <Bot />
            <span>Ask AI</span>
          </AISearchTrigger>
        </div>

        <div className="flex gap-4 mt-[40px] text-[#42424299] dark:text-[#E3E3E366] justify-center flex-wrap">
          <span className="flex items-center">Popular topics: </span>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              className="bg-[#E3E3E366] dark:bg-white/10 py-2 px-4 rounded-full"
              href={"/docs/getting-started"}
            >
              Getting Started
            </Link>
            <Link
              className="bg-[#E3E3E366] dark:bg-white/10 py-2 px-4 rounded-full"
              href={"/docs/folio-reader"}
            >
              Reader
            </Link>
            <Link
              className="bg-[#E3E3E366] dark:bg-white/10 py-2 px-4 rounded-full"
              href={"/docs/folio-discover"}
            >
              Discovery
            </Link>
            <Link
              className="bg-[#E3E3E366] dark:bg-white/10 py-2 px-4 rounded-full"
              href={"/docs/faqs"}
            >
              FAQs
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[72px] px-4">
          {docsCards.map((card) => (
            <Link
              key={card.title}
              href={card.link}
              className="border border-[#008F9F66] rounded-xl p-8  shadow-sm hover:shadow-md  hover:bg-[#008F9F] group transition-all"
            >
              <div className="flex  gap-4 flex-col items-center">
                <div className="bg-[#008F9F33]  border-[#008F9F] border rounded-full text-teal-600 group-hover:text-white  group-hover:border-white group-hover:bg-[#EBFDFF66] p-4">
                  <card.icon className="w-6 h-6 " />
                </div>

                <h3 className="text-lg font-semibold  group-hover:text-white">
                  {card.title}
                </h3>
                <p className="text-sm text-[#424242] dark:text-[#E3E3E3CC] max-w-[380px] text-center group-hover:text-white">
                  {card.description}
                </p>
                <span className="inline-block mt-2 text-[#232323] dark:text-[#E3E3E3CC] group-hover:text-white font-medium">
                  Learn More →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <footer className="bg-[#008F9F] rounded-t-4xl mt-[100px] p-4 w-full">
          <div className="container mx-auto max-w-[630px] flex flex-col items-center gap-2">
            <div className="footer-logo" />
            <p className="text-white">Save now. Read later.</p>

            <div className="flex gap-6 mt-4">
              {socialLinks.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  target="_blank"
                  className="text-[#E3E3E3CC] hover:text-gray-200 transition"
                >
                  <item.icon className="w-6 h-6" />
                </Link>
              ))}
            </div>

            <div className="w-full border-t border-white/30 mt-6"></div>

            <p className="text-xs mt-4 opacity-80 text-[#E3E3E3CC]">
              © 2025 Folio. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
      <SearchDialog />
    </main>
  );
}

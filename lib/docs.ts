import {
  BookOpen,
  Headphones,
  Search,
  User,
  Upload,
  Settings,
  Rocket,
  FolderSync,
  MessageCircleQuestionMark,
} from "lucide-react";

export const docsCards = [
  {
    icon: Rocket,
    title: "Getting Started",
    description:
      "Quick guide to download, install, and set up your Folio account.",
    link: "/docs/getting-started",
  },
  {
    icon: BookOpen,
    title: "Folio Reader",
    description:
      "Explore how to listen, search, and organize your saved content.",
    link: "/docs/folio-reader",
  },
  {
    icon: Search,
    title: "Folio Discover",
    description:
      "Easily save, share, and browse content directly from Discover.",
    link: "/docs/folio-discover",
  },
  {
    icon: User,
    title: "My Account",
    description:
      "Manage your account, reset passwords, and control your profile.",
    link: "/docs/my-account",
  },
  {
    icon: FolderSync,
    title: "Import & Sync To Folio",
    description: "Seamlessly import and sync saves from various platforms.",
    link: "/docs/import-sync",
  },
  {
    icon: Settings,
    title: "Settings & Preferences",
    description: "Access premium features, share data, and log out securely.",
    link: "/docs/settings-preferences",
  },
  {
    icon: MessageCircleQuestionMark,
    title: "Frequently Asked Questions (FAQs)",
    description:
      "Quickly find answers to the most common questions about the Folio app and its features.",
    link: "/docs/faqs",
    fullWidth: true,
  },
];

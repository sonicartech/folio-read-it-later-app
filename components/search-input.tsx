"use client";

import SearchDialog from "fumadocs-ui/components/dialog/search-default";
import { useState } from "react";

export function SearchInput() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <input
        type="text"
        placeholder="Search for anything or ask AI"
        className="bg-white dark:bg-fd-card dark:text-fd-foreground placeholder:text-gray-500 dark:placeholder:text-fd-muted-foreground w-[90%] max-w-[800px] rounded-full mt-[48px] border border-gray-200 dark:border-[#2BBFD0]/30 shadow-lg shadow-[#008F9F33] dark:shadow-[#2BBFD0]/10 p-6 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring"
        onClick={() => setOpen(true)}
        readOnly
      />
      <SearchDialog open={open} onOpenChange={setOpen} api="/api/search" />
    </>
  );
}

export function useSearchDialog() {
  const [open, setOpen] = useState(false);

  return {
    open,
    setOpen,
    SearchDialog: () => (
      <SearchDialog open={open} onOpenChange={setOpen} api="/api/search" />
    ),
  };
}

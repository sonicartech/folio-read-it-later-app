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
        className="dark:bg-[#EBEBEE] dark:placeholder:text-gray-500 w-[90%] max-w-[800px] rounded-full mt-[48px] border border-gray-200 shadow-lg shadow-[#008F9F33] p-6 cursor-pointer"
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

"use client";

export default function Cover({ imageUrl }: { imageUrl: string; }) {
  return (
    <div
      className="w-full h-52 bg-cover bg-center flex items-center rounded-2xl shadow-md mb-8"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
    </div>
  );
}
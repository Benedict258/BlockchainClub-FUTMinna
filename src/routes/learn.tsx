import { createFileRoute } from "@tanstack/react-router";
import { PageStub } from "@/components/page-stub";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — Master Web3 Engineering | BCF" },
      { name: "description", content: "Comprehensive curriculums for the next generation of blockchain developers. From Solidity to Move, start your journey." },
      { property: "og:title", content: "Master Web3 Engineering — Blockchain Club FUTMINNA" },
      { property: "og:description", content: "Tracks for EVM, Sui/Move, Aptos, and Solana." },
    ],
  }),
  component: () => <PageStub eyebrow="Education Hub" title="Master Web3 Engineering" blurb="Comprehensive curriculums designed for the next generation of blockchain developers. From Solidity to Move, start your journey here." />,
});
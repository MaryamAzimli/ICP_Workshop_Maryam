import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../declarations/mini_backend";

const agent = new HttpAgent({ host: "http://127.0.0.1:4943" });

// Always fetch root key in local development
agent.fetchRootKey().catch((err) => {
  console.warn("Unable to fetch root key. This is expected in local environments", err);
});

export const libraryManagementBackend = Actor.createActor(idlFactory, {
  agent,
  canisterId: "be2us-64aaa-aaaaa-qaabq-cai", // Replace with your backend canister ID
});

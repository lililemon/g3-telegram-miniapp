"use client";
import { TonConnectButton } from "@tonconnect/ui-react";
import styles from "./page.module.css";

export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <TonConnectButton />
    </main>
  );
}

"use client";

import styles from "../app/page.module.css";
import { API_PUBLIC_PREFIX, API_V1_PREFIX } from "@/lib/helper";

export default function TestApi() {
  return (
    <div className="flex flex-col gap-4">
      <button
        className={styles.primary}
        onClick={async () => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${API_PUBLIC_PREFIX}/hello`
          );
          const data = await res.json();
          console.log(data);
        }}
      >
        Fetch Public API
      </button>
      <button
        className={styles.primary}
        onClick={async () => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${API_V1_PREFIX}/user`,
            {
              credentials: "include",
            }
          );
          const data = await res.json();
          console.log(data);
        }}
      >
        Fetch Private API
      </button>
      <button
        className={styles.primary}
        onClick={async () => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${API_V1_PREFIX}/user`,
            {
              credentials: "include",
              method: "POST",
              body: JSON.stringify({ name: "" }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          console.log(data);
        }}
      >
        Fetch Private API with Invalid JSON
      </button>
      <button
        className={styles.primary}
        onClick={async () => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${API_V1_PREFIX}/user`,
            {
              credentials: "include",
              method: "POST",
              body: JSON.stringify({ name: "John", age: 20 }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await res.json();
          console.log(data);
        }}
      >
        Fetch Private API with Valid JSON
      </button>
    </div>
  );
}

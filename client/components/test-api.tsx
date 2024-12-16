"use client";

import styles from "../app/page.module.css";

export default function TestApi() {
  return (
    <>
      <button
        className={styles.primary}
        onClick={async () => {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/public/api/hello`
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
            `${process.env.NEXT_PUBLIC_API_URL}/api/hello`,
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
    </>
  );
}

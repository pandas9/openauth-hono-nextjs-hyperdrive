"use client";

import styles from "../app/page.module.css";
import { serverApi } from "@/lib/api";

export default function TestApi() {
  return (
    <div className="flex flex-col gap-4">
      <button
        className={styles.primary}
        onClick={async () => {
          const response = await serverApi.public.v1.hello.$get();
          const data = await response.json();
          console.log(data);

          const response2 = await serverApi.public.v1.world.$get();
          const data2 = await response2.json();
          console.log(data2);
        }}
      >
        Fetch Public API
      </button>
      <button
        className={styles.primary}
        onClick={async () => {
          const response = await serverApi.v1.user.$get();
          const data = await response.json();
          console.log(data);
        }}
      >
        Fetch Private API
      </button>
      <button
        className={styles.primary}
        onClick={async () => {
          const response = await serverApi.v1.user.$post({
            json: {
              name: "",
            },
          });
          const data = await response.json();
          console.log(data);
        }}
      >
        Fetch Private API with Invalid JSON
      </button>
      <button
        className={styles.primary}
        onClick={async () => {
          const response = await serverApi.v1.user.$post({
            json: {
              name: "John",
              age: 20,
            },
          });
          const data = await response.json();
          console.log(data);
        }}
      >
        Fetch Private API with Valid JSON
      </button>
      <button
        className={styles.primary}
        onClick={async () => {
          const response = await serverApi.v1.user["set-kv"].$get();
          const data = await response.json();
          console.log(data);
        }}
      >
        Set KV
      </button>
      <button
        className={styles.primary}
        onClick={async () => {
          const response = await serverApi.v1.user["get-kv"].$get();
          const data = await response.json();
          console.log(data);

          const response2 = await serverApi.v1.user[":id"].$get({
            param: {
              id: "1",
            },
          });
          const data2 = await response2.json();
          console.log(data2);
        }}
      >
        Get KV
      </button>
    </div>
  );
}

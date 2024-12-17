"use client";

import { useState } from "hono/jsx";
import styles from "../app/page.module.css";
import { serverApi } from "@/lib/api";

export default function TestApi() {
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Upload the file
      // hono client doesn't support multipart form data yet
      const uploadResponse = await fetch(`${serverApi.v1.upload.file.$url()}`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const uploadData = await uploadResponse.json();
      console.log("Upload response:", uploadData);

      setUploadedFileName(file.name);

      // Get the uploaded file
      window.open(
        `${serverApi.public.v1.files.file[":key"].$url({
          param: {
            key: file.name,
          },
        })}`,
        "_blank"
      );
    } catch (error) {
      console.error("Error handling file:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        className={styles.primary}
        onClick={async () => {
          const response = await serverApi.public.v1.system.health.$get();
          const data = await response.json();
          console.log(data);
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
              age: 20,
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
      <div className="flex flex-col gap-2">
        <input
          type="file"
          onChange={handleFileUpload}
          className={styles.primary}
        />
        {uploadedFileName && <p>Last uploaded file: {uploadedFileName}</p>}
      </div>
    </div>
  );
}

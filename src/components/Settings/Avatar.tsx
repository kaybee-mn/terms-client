import { useEffect, useState } from "react";
import supabase from "../../api/supabaseClient";

export default function Avatar(props: {
  url: string;
  onUpload: (event: any, url: string) => void;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string>(props.url);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (props.url) downloadImage(props.url);
  }, [props.url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image");
    }
  }

  async function uploadAvatar(event: any) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const userId = (await supabase.auth.getUser()).data.user?.id;
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `profile.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file,{
            upsert:true
        });

      if (uploadError) {
        throw uploadError;
      }

      await downloadImage(filePath);
      props.onUpload(event, filePath);
    } catch (error:any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <img
        src={avatarUrl ? avatarUrl : "/default_pfp.webp"}
        alt="Avatar"
        className="aspect-square w-40 rounded-full object-cover"
      />
      <div>
        <label className="button primary block" htmlFor="single">
          {uploading ? "Uploading ..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
}

import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { useAlert } from "../../contexts/AlertContext";

export default function Avatar() {
  const [uploading, setUploading] = useState(false);
  const { setAvatarLink, avatarUrl } = useUser();
  const { triggerAlert } = useAlert();

  async function uploadAvatar(event: any) {
    try {
      setUploading(true);
      // check if file exists and is an image
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      // sned file to usercontext to update pfp
      await setAvatarLink(file);
    } catch (error: any) {
      triggerAlert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <img
        src={avatarUrl || "/default_pfp.webp"}
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

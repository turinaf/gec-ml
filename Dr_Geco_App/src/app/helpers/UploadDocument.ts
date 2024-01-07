import axios from "axios";

export const HandleUploadDocument = async (file: File, _id: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("_id", _id);
  axios
    .post("/api/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(({ data }) => {
      if (data.error) {
        console.log(data);
      }
      window.location.href = `/account/docs/${data.documentId}/${data._id}`;
    })
    .catch((err) => {
      console.log("Error uploading from all documents page: \n", err);
    });
};

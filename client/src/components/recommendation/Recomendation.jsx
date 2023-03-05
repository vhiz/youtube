import { ErrorOutlineOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import Card from "../card/Card";
import "./recomendation.scss";

export default function Recomendation({ tags }) {
  const { isLoading, error, data } = useQuery(["tags", tags], async () => {
    const res = await makeRequest.get(`/videos/tags?tags=${tags}`);

    return res.data;
  });
  return (
    <div className="recomend">
      {error ? (
        <ErrorOutlineOutlined />
      ) : isLoading ? (
        <CircularProgress />
      ) : (
        data.map((video) => (
          <Card type={"small"} key={video._id} video={video} />
        ))
      )}
    </div>
  );
}

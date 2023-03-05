import { ErrorOutlineOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { makeRequest } from "../../axios";
import Card from "../../components/card/Card";
import Menu from "../../components/menu/Menu";
import Navbar from "../../components/navbar/Navbar";
import "./search.scss";

export default function Search() {
  const query = useLocation().search;
  const { isLoading, error, data } = useQuery(["search", query], async () => {
    const res = await makeRequest.get(`/videos/search${query}`);

    return res.data;
  });
  return (
    <div className="search">
      <Menu />
      <div className="searchContanier">
        <Navbar />
        <div className="searchWrapper">
          {error ? (
            <ErrorOutlineOutlined />
          ) : isLoading ? (
            <CircularProgress />
          ) : (
            data.map((video) => (
              <Card type={"big"} key={video._id} video={video} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

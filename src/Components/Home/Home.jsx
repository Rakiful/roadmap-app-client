import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { SingleRoadmap } from "../SingleRoadmap/SingleRoadmap";
import { AuthContext } from "../../Contexts/AuthContext";

export const Home = () => {
  const { loading } = useContext(AuthContext);
  const [roadmaps, setRoadmaps] = useState([]);
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/roadmap")
      .then((resp) => resp.json())
      .then((data) => {
        setRoadmaps(data);
      })
      .catch((error) => console.log(error));
  }, []);
  
  const getSortedRoadmaps = () => {
    let sorted = [...roadmaps];

    if (sortBy === "") {
      sorted = sorted;
    } else if (sortBy === "inProgress") {
      sorted = sorted.filter((r) => r.status === "In Progress");
    } else if (sortBy === "completed") {
      sorted = sorted.filter((r) => r.status === "Completed");
    } else if (sortBy === "frontend") {
      sorted = sorted.filter((r) => r.category === "Frontend");
    } else if (sortBy === "backend") {
      sorted = sorted.filter((r) => r.category === "Backend");
    } else if (sortBy === "categories") {
      sorted = sorted.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "popularity") {
      sorted = sorted.sort((a, b) => b.upvotes - a.upvotes);
    }

    return sorted;
  };

  if (loading) {
    return (
      <div className="flex justify-center h-screen">
        <span className="loading loading-spinner lg:p-10 loading-xl text-red-500"></span>
      </div>
    );
  }

  if (!roadmaps) {
    return (
      <div className="flex justify-center h-screen">
        <span className="loading loading-spinner lg:p-10 loading-xl text-red-500"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-4">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-red-500 mt-6">
          Career Roadmap
        </h1>
      </div>
      <div className="flex items-center justify-end my-7">
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select select-error"
          >
            <option value="">Sort By</option>
            <option value="inProgress">Status : In Progress</option>
            <option value="completed">Status : Completed</option>
            <option value="frontend">Categories : Frontend</option>
            <option value="backend">Categories : Backend</option>
            <option value="categories">Categories : (A-Z)</option>
            <option value="popularity">Popularity (upvotes)</option>
          </select>
        </div>
      </div>
      <div>
        {getSortedRoadmaps().map((roadmap) => (
          <SingleRoadmap key={roadmap._id} roadmap={roadmap} />
        ))}
      </div>
    </div>
  );
};

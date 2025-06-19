import React, { useEffect, useState } from "react";
import GuideCard from "./GuideCard";
import guideAPI from "../apiManger/guide";
import useGuideStore from "../store/guides";
import { NavLink } from "react-router-dom";
import { Button, Spin } from "antd";

const TopGuides = () => {
  const { setGuidesData } = useGuideStore();
  const [topGuides, setTopGuides] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to get 4 random guides from the array
  const selectTopGuides = (guides) => {
    const selected = [];
    const totalGuides = guides.length;

    while (selected.length < 4 && selected.length < totalGuides) {
      const randomIndex = Math.floor(Math.random() * totalGuides); // Get random index
      const randomGuide = guides[randomIndex];

      // Check if the random guide has already been selected
      if (!selected.includes(randomGuide)) {
        selected.push(randomGuide); // Add unique guide
      }
    }

    return selected; // Return the selected guides
  };

  const fetchAllGuides = async () => {
    setLoading(true);
    try {
      const response = await guideAPI.getAllGuides();
      const allGuides = response?.data?.guides || [];
      setGuidesData(allGuides); // Store all guides

      setTopGuides(selectTopGuides(allGuides)); // Set 4 random guides directly from the API response
    } catch (error) {
      console.error("Error fetching guides:", error);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchAllGuides();
  }, []);

  return (
    <div className="container mx-auto my-10">
      <h2 className="mb-8 text-3xl font-bold text-center">Top Guides</h2>
      {loading ? (
        <div className="flex justify-center my-10">
          <Spin size="large" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {topGuides.map((guide) => {
            return <GuideCard guide={guide} key={guide?._id} />;
          })}
        </div>
      )}
      <div className="mt-8 text-center">
        {/* Link to the view all guides page */}
        <NavLink to="/guides">
          <Button type="default" className="text-blue-500 hover:text-blue-700">
            View All
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default TopGuides;

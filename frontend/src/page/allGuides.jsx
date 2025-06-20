import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import useGuideStore from "../store/guides";
import GuideCard from "../components/GuideCard";
import guideAPI from "../apiManger/guide";
import Layout from "../components/Layout";

const AllGuides = () => {
  const { guidesData, setGuidesData } = useGuideStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAllGuides = async () => {
      setLoading(true);
      try {
        const response = await guideAPI.getAllGuides();
        const allGuides = response?.data?.guides || [];
        setGuidesData(allGuides);
      } catch (error) {
        console.error("Error fetching guides:", error);
      } finally {
        setLoading(false);
      }
    };

    if (guidesData.length === 0) {
      fetchAllGuides();
    }
  }, [guidesData, setGuidesData]);

  return (
    <Layout>
      <div className="container mx-auto my-10">
        <h2 className="mb-8 text-3xl font-bold text-center">
          Book Your Session Now
        </h2>
        <div className="flex justify-center mb-20">
          <input
            className="w-1/2 p-2 border border-gray-400 rounded outline-none"
            type="text"
            placeholder="Search guides..."
          />
        </div>
        {loading ? (
          <div className="flex justify-center my-10">
            <Spin size="large" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {guidesData.length > 0 ? (
              guidesData.map((guide) => (
                <GuideCard key={guide?._id} guide={guide} />
              ))
            ) : (
              <p className="col-span-4 text-center">No guides available.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AllGuides;

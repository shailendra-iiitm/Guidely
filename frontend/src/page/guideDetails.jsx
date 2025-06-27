import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import guideAPI from "../apiManger/guide";
import { Spin } from "antd";
import {
  AiFillFacebook,
  AiFillGithub,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillTwitterCircle,
} from "react-icons/ai";
import ServiceCardUserSide from "../components/ServiceCardUserSide";
import Layout from "../components/Layout";
import { BiErrorAlt } from "react-icons/bi";

const GuideDetails = () => {
  const { username } = useParams();
  const [guide, setGuide] = useState();
  const [services, setServices] = useState();
  const [guideLoading, setGuideLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    const fetchGuideDetails = async () => {
      try {
        setGuideLoading(true);
        const response = await guideAPI.getGuideByUsername(username);
        setGuide(response?.data?.guide);
        setGuideLoading(false);
        setServices(response?.data?.services);
        setServicesLoading(false);
      } catch (error) {
        console.error("Error fetching guide details:", error);
        setGuideLoading(false);
        setServicesLoading(false);
      }
    };

    fetchGuideDetails();
  }, [username]);

  return (
    <Layout>
      <div className="h-screen mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Guide's Profile */}
          <div className="col-span-1 p-6">
            {guideLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spin size="large" />
              </div>
            ) : guide ? (
              <>
                <div className="text-center">
                  <img
                    src={
                      guide?.photoUrl ||
                      `https://ui-avatars.com/api?name=${guide?.name}`
                    }
                    alt={`${guide?.name}'s avatar`}
                    className="w-48 h-48 mx-auto border-4 border-white shadow-lg rounded-full object-cover"
                  />
                  <h2 className="mt-4 text-3xl font-bold">
                    {guide?.name}
                  </h2>
                  {guide?.profile?.title && (
                    <p className="mt-2 text-lg text-gray-600">
                      {guide.profile.title}
                    </p>
                  )}
                  
                  {/* Real Statistics */}
                  <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {guide?.totalSessions || 0}
                      </div>
                      <div className="text-sm text-gray-600">Sessions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {guide?.averageRating ? `${guide.averageRating.toFixed(1)}★` : 'New'}
                      </div>
                      <div className="text-sm text-gray-600">Rating</div>
                    </div>
                  </div>
                </div>

                {/* Skills/Tags */}
                {guide?.skills?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {guide.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {guide?.profile?.bio && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {guide.profile.bio}
                    </p>
                  </div>
                )}

                {/* Location */}
                {guide?.profile?.location && (
                  <div className="mt-4">
                    <p className="text-gray-600">
                      📍 {guide.profile.location}
                    </p>
                  </div>
                )}

                {/* Social Links */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-center mb-4">
                    Connect with me
                  </h3>
                  {/* Debug: Show the social links structure in development */}
                  {/* {JSON.stringify(guide?.profile?.socialLinks)} */}
                  
                  <div className="flex justify-center space-x-4">
                    {/* LinkedIn */}
                    {guide?.profile?.socialLinks?.linkedin && guide.profile.socialLinks.linkedin.trim() !== "" ? (
                      <a
                        href={guide.profile.socialLinks.linkedin.startsWith('http') 
                          ? guide.profile.socialLinks.linkedin 
                          : `https://linkedin.com/in/${guide.profile.socialLinks.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform"
                        title="LinkedIn"
                      >
                        <AiFillLinkedin className="text-3xl text-blue-600" />
                      </a>
                    ) : (
                      <div className="text-gray-300" title="LinkedIn not provided">
                        <AiFillLinkedin className="text-3xl" />
                      </div>
                    )}
                    
                    {/* GitHub */}
                    {guide?.profile?.socialLinks?.github && guide.profile.socialLinks.github.trim() !== "" ? (
                      <a
                        href={guide.profile.socialLinks.github.startsWith('http') 
                          ? guide.profile.socialLinks.github 
                          : `https://github.com/${guide.profile.socialLinks.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform"
                        title="GitHub"
                      >
                        <AiFillGithub className="text-3xl text-gray-800" />
                      </a>
                    ) : (
                      <div className="text-gray-300" title="GitHub not provided">
                        <AiFillGithub className="text-3xl" />
                      </div>
                    )}
                    
                    {/* Twitter */}
                    {guide?.profile?.socialLinks?.Twitter && guide.profile.socialLinks.Twitter.trim() !== "" ? (
                      <a
                        href={guide.profile.socialLinks.Twitter.startsWith('http') 
                          ? guide.profile.socialLinks.Twitter 
                          : `https://twitter.com/${guide.profile.socialLinks.Twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform"
                        title="Twitter"
                      >
                        <AiFillTwitterCircle className="text-3xl text-blue-400" />
                      </a>
                    ) : (
                      <div className="text-gray-300" title="Twitter not provided">
                        <AiFillTwitterCircle className="text-3xl" />
                      </div>
                    )}
                    
                    {/* Facebook */}
                    {guide?.profile?.socialLinks?.facebook && guide.profile.socialLinks.facebook.trim() !== "" ? (
                      <a
                        href={guide.profile.socialLinks.facebook.startsWith('http') 
                          ? guide.profile.socialLinks.facebook 
                          : `https://facebook.com/${guide.profile.socialLinks.facebook}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform"
                        title="Facebook"
                      >
                        <AiFillFacebook className="text-3xl text-blue-700" />
                      </a>
                    ) : (
                      <div className="text-gray-300" title="Facebook not provided">
                        <AiFillFacebook className="text-3xl" />
                      </div>
                    )}
                    
                    {/* Website */}
                    {guide?.profile?.socialLinks?.website && guide.profile.socialLinks.website.trim() !== "" ? (
                      <a
                        href={guide.profile.socialLinks.website.startsWith('http') 
                          ? guide.profile.socialLinks.website 
                          : `https://${guide.profile.socialLinks.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition-transform"
                        title="Website"
                      >
                        <AiFillInstagram className="text-3xl text-pink-500" />
                      </a>
                    ) : (
                      <div className="text-gray-300" title="Website not provided">
                        <AiFillInstagram className="text-3xl" />
                      </div>
                    )}
                  </div>
                  
                  {/* Message when no social links are available */}
                  {(!guide?.profile?.socialLinks || 
                    Object.values(guide.profile.socialLinks || {}).every(link => !link || link.trim() === "")) && (
                    <p className="text-center text-gray-500 text-sm mt-4">
                      Social links not yet provided
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p>Guide not found.</p>
            )}
          </div>

          {/* Guide's Services */}
          <div className="col-span-2 p-6 h-screen bg-[#F5F5F5]">
            <h3 className="mb-4 text-2xl font-bold">Book a Session</h3>

            {servicesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Spin size="large" />
              </div>
            ) : services && services.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <ServiceCardUserSide
                    username={guide?.username}
                    service={service}
                    key={service?._id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-700">
                <BiErrorAlt className="w-24 h-24 mb-4 text-blue-500" />
                <h3 className="mb-2 text-xl font-semibold">
                  Oops! No Services Available
                </h3>
                <p className="mb-6 text-lg text-gray-500">
                  It seems like there are no services available at the moment.
                  Please check back later!
                </p>
                <button
                  className="px-6 py-3 text-white transition-colors bg-blue-500 rounded-lg shadow-lg hover:bg-blue-600"
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GuideDetails;

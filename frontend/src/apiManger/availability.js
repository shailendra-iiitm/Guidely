import AxiosInstances from ".";

const getGuideAvailability = async (guideId, duration) => {
  return await AxiosInstances.get(
    `availability/${guideId}?duration=${duration}`
  );
};

export default { getGuideAvailability };

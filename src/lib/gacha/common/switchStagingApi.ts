const switchStagingApi = (useStaging?: boolean) => {
  if (useStaging) {
    return 'http://localhost:5001/napoancom/us-central1/entityatsume-';
  } else {
    return process.env.API_URL + '/entityatsume-';
  }
};

export default switchStagingApi;

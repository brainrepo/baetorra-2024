export const getUserId = (req) => {
  return req?.accountability?.user || false;
};

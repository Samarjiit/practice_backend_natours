module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); //get rid of catch block so any error happend it will come her eand send to errorcontroller handler
  };
};

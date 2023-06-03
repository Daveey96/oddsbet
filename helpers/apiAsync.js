export default (func) => {
  try {
    func();
  } catch (error) {}
};

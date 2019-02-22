module.exports = {
  AddPost (req, res) {
    console.log ('hello');
    console.log (req.cookies);
    console.log (req.user);
  },
};

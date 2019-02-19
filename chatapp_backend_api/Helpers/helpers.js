module.exports = {
  firstLetterUpperCase: username => {
    const name = lowerCase (username);
    return name.charAt (0).toUpperCase () + name.slice (1);
  },

  lowerCase: str => {
    return str.toLowerCase ();
  },
};

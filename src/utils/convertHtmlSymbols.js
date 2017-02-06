const convertHtmlSymbols = (string) => {
  if (typeof string === 'string') {
    string = string.replace(/&/g, "&amp;");
    string = string.replace(/>/g, "&gt;");
    string = string.replace(/</g, "&lt;");
    string = string.replace(/"/g, "&quot;");
    string = string.replace(/'/g, "&#039;");
    return string;
  } else {
    return string;
  }
};

export default convertHtmlSymbols;

const helpers = {


  // a  tage to check if the data has already been recorded
  ifRecorded: function (status, options) {
    if (status == "recorded") {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  // a  tage to check if the data has already been recorded
  ifUnrecorded: function (status, options) {
    if (status == "unrecorded") {
      return options.fn(this);
    }
    return options.inverse(this);
  },

   // a  tage to check if is required 
  ifUnrequired: function (status, options) {
    if (status == "unrequired") {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  // a  tage to check if is abnormal 
  ifAbnormal: function (min, max, value, options) {
    
    if (value < min || value > max) {
      return options.fn(this);

    }
    return options.inverse(this);
  },

   // a  tage to check if is used recently 
  ifRecent: function (date, options) {
    var today = new Date().toDateString();
    if (date === today) {
      return options.fn(this);
    }
    return options.inverse(this);
  }


};

module.exports.helpers = helpers;

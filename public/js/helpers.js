const helpers = {
  ifRecorded: function (status, options) {
    if (status == "recorded") {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  ifUnrecorded: function (status, options) {
    if (status == "unrecorded") {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  ifUnrequired: function (status, options) {
    if (status == "unrequired") {
      return options.fn(this);
    }
    return options.inverse(this);
  },

  ifAbnormal: function (min, max, value, options) {
    if (value > min && value < max) {
      return options.fn(this);

    }
    return options.inverse(this);
  }


};

module.exports.helpers = helpers;

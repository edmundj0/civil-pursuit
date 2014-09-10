module.exports = function ($http) {
  return {
    find: function () {
      return $http.get('/json/Topic');
    },

    findBySlug: function (slug) {
      return $http.get('/json/Topic/findOne?slug=' + slug);
    },

    findById: function (id) {
      return $http.get('/json/Topic/findById/' + id);
    }
  };
};
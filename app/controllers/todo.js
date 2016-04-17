module.exports = {

  find: function (req, res) {
    Todo
    .find()
    .sort("createdAt DESC")
    .exec(function (err, todos) {
      if (err) return res.send(err);
      res.json(todos);
    });
  },

  create: function (req, res) {
    Todo
    .create(req.body)
    .exec(function (err, todo) {
      if (err) return res.send(err);
      res.json(todo);
    });
  },

  update: function (req, res) {
    var id = req.params.id;
    Todo
    .update(id, req.body)
    .exec(function (err, todo) {
      if (err) return res.send(err);
      res.json(todo[0]);
    });
  },

  destroy: function (req, res) {
    var ids = req.params.id || req.body.ids;
    Todo
    .destroy(ids)
    .exec(function (err) {
      if (err) return res.send(err);
      res.sendStatus(200);
    });
  }

};
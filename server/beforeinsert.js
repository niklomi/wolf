Posts.before.insert(function (userId, doc) {
  doc.createdAt = new Date();
  doc.new_job = true;
});




const MovieModel = require("../../models/comment");
const mongoose = require("mongoose");

//유효한 id인지 체크 function
const checkId = (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }
  next();
};

//목록 조회
// - 성공 : limit 수만큼 music 객체를 담는 배열을 리턴 (200: OK)
// - 실패 : limit가 숫자가 아닌경우 (400: Bad Request)
const list = (req, res) => {
  const limit = parseInt(req.query.limit || 10, 10);
  if (Number.isNaN(limit)) return res.status(400).end();

  // res.json(music.slice(0, limit));
  ComSchema.find((err, result) => {
    if (err) return res.status(500).end();
    res.render("upload/list", { result });
  })
    .limit(limit)
    .sort({ _id: -1 });
};

//상세조회 (localhost:3000/api/music/:id)
// - 성공 : id에 해당하는 music 객체 리턴 (200: OK)
// - 실패 : id가 숫자가 아닌 경우 (400 : Bad Request)
//          해당하는 id가 없는 경우(404 : Not Found)

const detail = (req, res) => {
  const id = req.params.id;

  //id로 조회
  MovieModel.findById(id, (err, result) => {
    if (err) return res.status(500).end();
    if (!result) return res.status(404).end();
    res.render("movie/detail", { result });
  });
};

//등록 (POST localhost:3000/api/music)
// - 성공 : id값 채번, 입력된 siger, title값으로 객체를 만들고
//         배열 추가(201: Created)
// - 실패 :singer, title 값 누락시 (400 : Bad Request)
const create = (req, res) => {
  const { title, director, year } = req.body;
  console.log(title);
  if (!title || !director || !year) return res.status(400).end();

  MovieModel.create({ title, director, year }, (err, result) => {
    if (err) return res.status(500).end();
    res.status(201).json(result);
  });
};

//수정 (PUT localhost:3000/api/music/:id)
// - 성공 : id에 해당하는 객체의 값을 변경 후 리턴(200: OK)
// - 실패 : id가 숫자가 아닌 경우 (400: Bad Request)
//         해당하는 id가 없는 경우(404 : Not Found)
const update = (req, res) => {
  const id = req.params.id;

  const { title, director, year } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }

  //2. id에 해당하는 Document에 입력받은 Data로 Update
  MovieModel.findByIdAndUpdate(
    id,
    { title, director, year },
    { new: true },
    (err, result) => {
      if (err) return res.status(500).send("수정 시 오류가 발생했습니다!");
      if (!result) return res.status(404).end("해당하는 정보가 없습니다!");
      res.json(result);
    }
  );
};

//delete (DELETE localhost:3000/api/music/:id)
// - 성공 : id에 해당하는 객체를 배열에서 삭제 후 배열 리턴 (200: OK)
// - 실패 : id가 숫자가 아닌 경우 (400: Bad Request)
//         해당하는 id가 없는 경우(404 : Not Found)
const remove = (req, res) => {
  const id = req.params.id;

  //2. id에 해당하는 Document를 찾아ㅏ서 DB에서 삭제
  MovieModel.findByIdAndDelete(id, (err, result) => {
    if (err) return res.status(500).send("삭제 시 오류가 발생했습니다!");
    if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
    res.json(result);
  });
};

const showCreatePage = (req, res) => {
  // console.log("Test");
  res.render("movie/create");
};

const showUpdatePage = (req, res) => {
  const id = req.params.id;

  MovieModel.findById(id, (err, result) => {
    // console.log(err);
    if (err) return res.status(500).end();
    if (!result) return res.status(404).end();
    res.render("movie/update", { result });
  });
};

module.exports = {
  list,
  detail,
  create,
  update,
  remove,
  checkId,
  showCreatePage,
  showUpdatePage
};

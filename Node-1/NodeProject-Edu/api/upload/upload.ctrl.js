const ComModel = require("../../models/comment");
const UserModel = require("../../models/user");
const mongoose = require("mongoose");

//유효한 id인지 체크 function
const checkId = (req, res, next) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).end();
  }
  next();
};

//목록 조회 (localhost:3000/api/music?limit=10)
// - 성공 : limit 수만큼 music 객체를 담는 배열을 리턴 (200: OK)
// - 실패 : limit가 숫자가 아닌경우 (400: Bad Request)
const list = (req, res) => {
  //지금 로그인된 계정의 체널아이디 값 가져오기
  //아니면 전역 변수로 뿌리기
  console.log(res.locals.user.channel);
  var channel = res.locals.user.channel;

  //UCIB5sKY_tyFQ553zWeMetTA
  console.log("hi");
  var url =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" +
    channel +
    "&order=date&maxResults=30&key=AIzaSyBgkEnmrsUNipuvUrQP5urN1QcoWFaRn4Y&type=video";

  function call(nextToken) {
    var req = require("axios");
    var pageToken = "";
    if (nextToken) {
      pageToken = "&pageToken=" + nextToken;
    }
    console.log(url);
    req
      .get(url + pageToken || "")
      .then(ress => {
        const items = ress.data.items;
        res.render("upload/list", { items });
      })
      .catch(error => {
        console.log(error.message);
      });
  }
  call();
};

//상세조회 (localhost:3000/api/music/:id)
// - 성공 : id에 해당하는 music 객체 리턴 (200: OK)
// - 실패 : 유효한 id가 아닌 경우 (400 : Bad Request)
//          해당하는 id가 없는 경우(404 : Not Found)
const detail = (req, res) => {
  const id = req.params.item;
  console.log("~ " + id);
  var channel = res.locals.user.channel;

  var url =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" +
    channel +
    "&order=date&maxResults=30&key=AIzaSyBgkEnmrsUNipuvUrQP5urN1QcoWFaRn4Y&type=video&q=" +
    id;

  function call(nextToken) {
    var req = require("axios");
    var pageToken = "";
    if (nextToken) {
      pageToken = "&pageToken=" + nextToken;
    }
    req.get(url + pageToken || "").then(ress => {
      const items = ress.data.items;
      ComModel.find({ videoId: id }, (err, result) => {
        if (err) return res.status(500).end();
        console.log("~ db에서 찾음");
        res.render("upload/detail", {
          result,
          items: items[0]
        });
      }).sort({ _id: -1 });
    });
  }
  call();
};

//등록 (POST localhost:3000/api/upload)
// - 성공 : id값 채번, 입력된 siger, title값으로 객체를 만들고 DB추가
//         배열 추가(201: Created)
// - 실패 :singer, title 값 누락시 (400 : Bad Request)
const create = (req, res) => {
  console.log("~ 여기!");

  const { comment, videoId, name, roles } = req.body;
  console.log(comment, videoId, name, roles);
  if (!comment || !videoId || !name || !roles) return res.status(400).end();

  ComModel.create({ comment, videoId, name, roles }, (err, result) => {
    console.log("err:", err);
    if (err) return res.status(500).end();
    res.status(201).json(result);
  });
};

//수정 (PUT localhost:3000/api/music/:id)
// - 성공 : id에 해당하는 객체의 값을 변경 후 리턴(200: OK)
// - 실패 : 유효한 id가 아닌 경우 (400: Bad Request)
//         해당하는 id가 없는 경우(404 : Not Found)
const update = (req, res) => {
  const id = req.params.id;

  const { singer, title } = req.body;

  //2. id에 해당하는 Document에 입력받은 Data로 Update
  MusicModel.findByIdAndUpdate(
    id,
    { singer, title },
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
  MusicModel.findOneAndDelete(id, (err, result) => {
    if (err) return res.status(500).send("삭제 시 오류가 발생했습니다!");
    if (!result) return res.status(404).send("해당하는 정보가 없습니다.");
    res.json(result);
  });
};

const showCreatePage = (req, res) => {
  console.log("~ showCreatePage here!");
  res.render("upload/create", { id: req.params.item });
};

const showUpdatePage = (req, res) => {
  const id = req.params.id;

  MusicModel.findById(id, (err, result) => {
    // console.log(err);
    if (err) return res.status(500).send("여긴가?");
    if (!result) return res.status(404).end();
    res.render("upload/update", { result });
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

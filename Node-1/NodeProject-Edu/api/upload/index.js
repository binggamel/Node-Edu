// 라우팅 모듈 작성
const express = require("express");
const router = express.Router();
const ctrl = require("./upload.ctrl");

// 목록조회
//localhost:3000/music/
router.get("/", ctrl.list);

// 등록페이지
router.get("/:item/new", ctrl.showCreatePage);

// 상세조회 (localhost:3000/api/upload/videoId)
router.get("/:item", ctrl.detail);

//수정페이지
router.get("/:id/edit", ctrl.checkId, ctrl.showUpdatePage);

// 등록
router.post("/:item", ctrl.create);

// 수정
router.put("/:id", ctrl.checkId, ctrl.update);

// 삭제
router.delete("/:id", ctrl.checkId, ctrl.remove);

module.exports = router;

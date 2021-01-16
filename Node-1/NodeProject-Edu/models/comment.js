const mongoose = require("mongoose");

//schema create
const ComSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true
  },
  videoId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  roles: {
    type: String,
    required: true,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  }
});

//스키마를 통한 모델 객체 생성
//mongoose.model("모델 명", 스키마) -> 모델명s
module.exports = mongoose.model("comment", ComSchema);

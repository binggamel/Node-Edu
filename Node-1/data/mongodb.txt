1. 관계형 데이터베이스(RDB) : MySQL, MariaDB, MSSQL, Oracle, SQLite, PostgreSQL
-관계형 모델 설계
-데이블 스키마 고정
-SQL문에 CRUD

2. NoSQL
-스키마 운동
-저자으 단순검색어 유리함
-빅데이터 -> 분산 서버에 용이

3. Mongo DB 테스트
1) server 실행 : mongod --dbpath=data
2) Client 실행 : mongo

4. MongoDB Shell Command
1) Database
- db
- show dbs
- use <db명> // 이름 바꾸기
- db.dropDatabase()

2) Collection
- db.createCollection("collection name")
- show collection
- db.music.drop()

3) Document
- db.music.insert({ .. })
- db.music.find()
- db.music.find().pretty()
- db.music.find({조회조건})
- db.music.find({},{_id : 0, singer: 1, title:1, ..})
- db.music.find().limit(2)
- db.music.update({조회조건},{수정할내용})
- db.music.update({조회조건},{$set : {수정할내용}})
- db.music.remove({삭제조건})
- db.music.remove({})

5. ODM (Object Dacument Mapping) tool
1) schema 생성
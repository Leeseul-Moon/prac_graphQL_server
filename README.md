# GraphQL

GraphQL 개념을 익히기 위해 [노마드코더 GraphQL로 영화 API 만들기](https://nomadcoders.co/graphql-for-beginners/lobby) 강의를 보고 작성한 repo 입니다. </br>

## 배운 점
- GraphQL 의 개념 이해 : REST API 의 over fetching, under fetching 문제를 해결하기 위해 고안된 개념
- from REST API to GraphQL : REST API 를 감싸서 GraphQL 처럼 사용할 수 있다
```javascript
type Query {
  allMovies: [Movie!]!
  movie(id: String!): Movie
}
const resolvers = {
  Query: {
    allMovies() {
      return fetch("https://yts.mx/api/v2/list_movies.json")
        .then((r) => r.json())
        .then((json) => json.data.movies);
    },
    movie(_, { id }) {
      return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
        .then((r) => r.json())
        .then((json) => json.data.movie);
    },
  },
```
- 타입을 resolvers 하여 db 에 없는 값을 만들어 줄 수 있다.
```javascript
  User: {
    // fullName(root) {
    // console.log("root :>> ", root); // 각 User 정보를 가지고 있어서 fullName 을 갖기 위해 Row만큼 돈다 -> 각 User 별 fullName 을 만든다.
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
```
- 테이블 합치기
```javascript
  Tweet: {
    // root 에서 userId 값을 가져옴. 여기서 root 값은 하나의 tweet
    author({ userId }) {
      return users.find((user) => user.id === userId); // 실제 db 가 아닌 메모리에 저장된 것을 예시로 함.
    },
  },
```

🦜 resolver 가 실행되는 순서를 잘 따라가야 한다. log 로 하나씩 찍어서 어떤 순서로 실행되어 어떤 값이 root 로 전달되는지를 파악하면, </br>
타입 resolver, 테이블 합치는 방식에 대한 이해가 쉽다.

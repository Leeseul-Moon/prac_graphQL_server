import { ApolloServer, gql } from "apollo-server";

const tweets = [
  {
    id: "1",
    text: "Hello, world!",
    userId: "2",
  },
  {
    id: "2",
    text: "Bye, world!",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Bob",
  },
  {
    id: "2",
    firstName: "judy",
    lastName: "kim",
  },
];

// 가장 상위 타입은 Query 로 해야 함!
// allTweets: [Tweet!]! 배열 안에는 꼭 Tweet 만 들어가야 한다는 뜻. 그리고 안에 내용이 없더라도 [] 을 갖는다는 뜻.
// fullName 은 db 에 없지만 resolvers 에서 만들어짐! allUsers 의 리턴 users 에서 fullName 이
// 없다는 것을 알고 User 에서 fullName() 함수를 찾아서 실행시켜서 데이터를 만들어줌.
const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  """
  Tweet object represents a resource for a Tweet 🦜
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allMovies: [Movie!]!
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    movie(id: String!): Movie
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet!
    deleteTweet(id: ID!): Boolean!
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String!
    title_long: String!
    slug: String!
    year: Int!
    rating: Float!
    runtime: Float!
    genres: [String]!
    summary: String
    description_full: String!
    synopsis: String
    yt_trailer_code: String!
    language: String!
    background_image: String!
    background_image_original: String!
    small_cover_image: String!
    medium_cover_image: String!
    large_cover_image: String!
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    // tweet(root, args) {
    tweet(root, { id }) {
      // console.log(root); // undefined
      // console.log(args); // {id: '1'} user 가 query 로 보낸 값이 들어감
      return tweets.find((tweet) => tweet.id === id);
    },
    allUsers() {
      console.log("allUsers!");
      return users;
    },
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

  Mutation: {
    // mutation 을 나눈 것은 강제되는 것은 아니지만, 분리하여 작성하는 것이 일반적임.
    postTweet(root, { text, userId }) {
      const newTweet = { id: tweets.length + 1, text, userId };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(root, { id }) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;
      tweets.splice(tweets.indexOf(tweet), 1);
      return true;
    },
  },

  User: {
    // fullName(root) {
    fullName({ firstName, lastName }) {
      // console.log("root :>> ", root); // 각 User 정보를 가지고 있어서 fullName 을 갖기 위해 두 번 돌음.
      // console.log("fullName!");
      return `${firstName} ${lastName}`;
    },
  },

  Tweet: {
    // root 에서 userId 값을 가져옴. 여기서 root 값은 하나의 tweet
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Running on ${url}`);
});

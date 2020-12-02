import { config } from "dotenv"
import { graphql } from "@octokit/graphql"
config()

const { repository } = await graphql(
  `
    {
      repository(owner: "octokit", name: "graphql.js") {
        issues(last: 3) {
          edges {
            node {
              title
            }
          }
        }
      }
    }
  `,
  {
    headers: {
      authorization: `token ${process.env.GH_ACCESS_TOKEN}`,
    },
  }
)

console.log(repository)
